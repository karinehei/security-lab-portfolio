# WEB-002 — Insufficient JWT session expiration

| Field | Value |
| --- | --- |
| **Finding ID** | WEB-002 |
| **Title** | Access tokens never expire and expired tokens are still accepted |
| **OWASP category** | OWASP Top 10 (2021) — **A07:2021 Identification and Authentication Failures**; OWASP API Security Top 10 (2023) — **API2:2023 Broken Authentication** |
| **CWE** | [CWE-613](https://cwe.mitre.org/data/definitions/613.html) Insufficient Session Expiration; related [CWE-287](https://cwe.mitre.org/data/definitions/287.html) Improper Authentication |
| **Severity** | **Medium** (extends the window after a token is obtained; does not by itself steal credentials) |
| **CVSS 3.1 base** | **5.3 Medium** — `CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:H/I:N/A:N` |
| **Affected component** | Local lab API token issue and verify in [`authService.ts`](../web-api-security/vulnerable-api/src/services/authService.ts) |
| **Lab modes** | Present when `LAB_MODE=vulnerable`. Absent when `LAB_MODE=secure`. |
| **Status** | Intentional training defect + remediated secure path + automated tests |

This finding applies only to the **intentionally vulnerable document API in this repository**, running on `127.0.0.1`. It is not an assessment of any third-party identity provider or production site. WEB-001 (IDOR) is a separate control and is unchanged.

---

## CVSS reasoning

| Metric | Choice | Why |
| --- | --- | --- |
| Attack Vector | Network | The session is an HTTP Bearer token. |
| Attack Complexity | High | The defect does not mint a token for the tester. A token must already have been issued (login) and then obtained from a local log, copy-paste, or similar side channel **in this lab**. |
| Privileges Required | Low | The token is a normal-user (or admin) session, not a pre-auth bypass. |
| User Interaction | None | Replay does not need the victim to click again. |
| Scope | Unchanged | Impact stays in this API. |
| Confidentiality | High | A durable session can call the same read APIs as the original user (and WEB-001 if that lab mode is also on). |
| Integrity | None | This finding is lifetime of a read/write session token, not a forged identity without the HMAC secret. Tokens remain HS256-signed. |
| Availability | None | The service is not taken down. |

The **base score is 5.3 (Medium)** using AC:High because missing `exp` is an *amplifier* of token exposure, not a password-hash crack. Organizational severity stays Medium unless a separate finding shows trivial token theft (for example XSS), which is **not** implemented here.

---

## Description

Login still does the right thing with **passwords**: bcrypt at rest, `bcrypt.compare` on `/api/auth/login`, generic `401 Invalid credentials`. After that success, vulnerable mode issues an HS256 JWT **with no `exp` claim** and verifies later with `ignoreExpiration: true`.

The server therefore cannot tell a two-minute-old session from a two-year-old copy of the same string.

### Penetration tester perspective

Authentication testing is not only “does login reject a wrong password?”. Inspect the **session artefact**:

1. Log in as a lab user.
2. Decode the JWT payload (local Base64url; do not send the token to a public debugger if it were a real token — here it is a fictional lab secret).
3. Note the absence of `exp`.
4. Confirm that a token minted with `exp` in the past is still accepted on `GET /api/me`.

That is Broken Authentication: the password control is fine; the **session** control is not.

### Software developer perspective

`jsonwebtoken.sign` without `expiresIn` produces a token that `jwt.verify` will accept forever, unless the verifier also requires `exp`. Setting `ignoreExpiration: true` (often copied from a clock-skew workaround) disables the library's only time check. The fix is a short TTL, an algorithm allowlist, and a hard fail when `exp` is missing — not a faster hash and not “alg: none”.

---

## Prerequisites

- Lab API on `http://127.0.0.1:3000` with `LAB_MODE=vulnerable`.
- Seeded user `alice@local.lab` / `LabPassw0rd!` (fictional).
- Ability to decode a JWT locally and to call `/api/me` with `Authorization: Bearer`.

No malware, no keylogger, and no host outside this repository.

---

## Reproduction

Perform these calls only against `http://127.0.0.1:3000`.

### 1. Confirm lab mode

```http
GET /health HTTP/1.1
Host: 127.0.0.1:3000
```

Expect `"labMode": "vulnerable"`.

### 2. Log in

```http
POST /api/auth/login HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/json

{"email":"alice@local.lab","password":"LabPassw0rd!"}
```

**Vulnerable:** body includes `"expiresInSeconds": null`.  
**Secure:** `"expiresInSeconds": 900`.

### 3. Inspect the token (local)

Split `token` on `.` and Base64url-decode the payload. Vulnerable mode has no `exp`. Secure mode has `exp` about 15 minutes ahead.

### 4. Expired token still used as a session

Automated tests mint an HS256 token for Alice with `exp` in the past, using the **local** `JWT_SECRET`, then:

```http
GET /api/me HTTP/1.1
Host: 127.0.0.1:3000
Authorization: Bearer <expired-lab-token>
```

**Expected in `LAB_MODE=vulnerable`:** `200` and Alice's profile.  
**Expected in `LAB_MODE=secure`:** `401`.

Do not use this pattern against any other host. The minting helper exists only in [tests/helpers.ts](../web-api-security/vulnerable-api/tests/helpers.ts) for this lab.

---

## Evidence

No screenshots.

**Vulnerable login (representative)**

```http
HTTP/1.1 200 OK
X-Lab-Mode: vulnerable
Content-Type: application/json

{
  "token": "<header>.<payload-without-exp>.<signature>",
  "user": { "id": 1, "email": "alice@local.lab", "role": "USER" },
  "expiresInSeconds": null
}
```

**Secure login (representative)**

```http
HTTP/1.1 200 OK
X-Lab-Mode: secure
Content-Type: application/json

{
  "token": "<header>.<payload-with-exp>.<signature>",
  "user": { "id": 1, "email": "alice@local.lab", "role": "USER" },
  "expiresInSeconds": 900
}
```

Automated evidence:

- [tests/vulnerable/auth.vulnerable.test.ts](../web-api-security/vulnerable-api/tests/vulnerable/auth.vulnerable.test.ts)
- [tests/secure/auth.secure.test.ts](../web-api-security/vulnerable-api/tests/secure/auth.secure.test.ts)
- Semgrep: `security-lab.jwt-ignore-expiration` in [devsecops/semgrep/lab-coverage.yaml](../devsecops/semgrep/lab-coverage.yaml)

---

## Impact

While `JWT_SECRET` is unchanged, anyone who holds a copy of a vulnerable-mode access token can call authenticated routes **without a new login**, including after the user believes they “logged out” on the client. Combined with WEB-001 in the same process, that durable session can also read other users' documents. The two findings stack; they are still tracked separately.

Password hashes in PostgreSQL are not weakened by this issue.

---

## Root cause

Session lifetime was left to chance:

1. `signVulnerableAccessToken` calls `jwt.sign` with HS256 and **no** `expiresIn`.
2. `verifyVulnerableAccessToken` calls `jwt.verify` with **`ignoreExpiration: true`**.
3. There is no other server-side session store to revoke the token.

Password hashing is not the root cause.

---

## Remediation

1. Issue access tokens with a short `exp` (this lab: 15 minutes).
2. Verify with `algorithms: ["HS256"]` and `ignoreExpiration: false`.
3. Reject tokens that have no `exp` claim.
4. Keep bcrypt for passwords; do not “fix” this finding by switching hashes.
5. Treat `JWT_SECRET` as a credential: local fictional value only; rotate if leaked.
6. Document any future `ignoreExpiration` as a time-limited, reviewed exception — never as a default.

Follow-up (not in this iteration): refresh tokens with rotation, server-side revocation on password change, and binding tokens to a `tokenVersion` column.

---

## Verification

| Check | Vulnerable | Secure |
| --- | --- | --- |
| Login `expiresInSeconds` | `null` | `900` |
| JWT payload `exp` | absent | ~15 minutes |
| Expired HS256 lab token on `GET /api/me` | `200` | `401` |
| Wrong password | `401` | `401` |
| WEB-001 IDOR tests | unchanged | unchanged |

```bash
cd web-api-security/vulnerable-api
npm run test:vulnerable
npm run test:secure
```

---

## Secure implementation

[`signSecureAccessToken`](../web-api-security/vulnerable-api/src/services/authService.ts) / [`verifySecureAccessToken`](../web-api-security/vulnerable-api/src/services/authService.ts):

- `expiresIn: config.jwtExpiresInSeconds` (900)
- `algorithms: ["HS256"]`
- `clockTolerance: 0`
- `ignoreExpiration: false`
- missing `exp` → `AuthError`

Password path remains `bcrypt.hash` (seed) and `bcrypt.compare` (login) in **both** modes.

---

## Lessons learned

**From testing.** After login, decode the token. Collection of auth findings includes TTL, algorithm, and error messages — not only “can I log in”.

**From engineering.** `ignoreExpiration` is not a convenience flag; it deletes the session control. Clock skew is handled with a small `clockTolerance`, not by ignoring `exp`.

**From DevSecOps.** A one-line Semgrep rule catches this class in CI so it does not rely on a manual JWT inspection next time. See [devsecops/README.md](../devsecops/README.md).

---

## References (local)

- Lab notes: [docs/authentication-lab.md](../web-api-security/vulnerable-api/docs/authentication-lab.md)
- IDOR (unchanged): [WEB-001](./WEB-001-broken-object-level-authorization.md)
- Methodology: [docs/methodology.md](../docs/methodology.md)
- Skills index: [skills.md](../skills.md)

# Authentication and session lab

Second controlled defect on the same local document API. **WEB-001 (IDOR) is unchanged.**

## Finding

**WEB-002 — Insufficient JWT session expiration**

Passwords stay on bcrypt in both modes. The training gap is what happens *after* a correct login: the access token's lifetime.

| Mode | Token issue | Token verify |
| --- | --- | --- |
| `LAB_MODE=vulnerable` | HS256 JWT **without** `exp`. Login body `expiresInSeconds: null`. | `ignoreExpiration: true` — expired tokens still work |
| `LAB_MODE=secure` | HS256 JWT, `exp` in **15 minutes**, `expiresInSeconds: 900` | Algorithm allowlist, expiration enforced, missing `exp` rejected |

Assessment: [WEB-002](../../../reports/WEB-002-authentication-security.md).

## Why this defect (not a weaker password hash)

A SHA-1 password demo is easy to spot and rarely how a Node service actually fails. Real APIs more often:

- hash passwords correctly, then
- issue a Bearer JWT that never expires, and
- verify it with `ignoreExpiration: true` “to stop clock-skew tickets”

That is a **session-security** failure sitting on top of otherwise sound password handling. The secure path shows both sides: bcrypt at rest, short-lived tokens in motion.

## Attack surface (local lab only)

- `POST /api/auth/login` — issues the token
- `Authorization: Bearer` on every authenticated route (`/api/me`, documents, admin)

No credential-stealing feature, no persistence implant, and no call to a system outside this repository. Tests mint an expired JWT with the **local** `JWT_SECRET` from `.env` to prove the verifier's behaviour.

## Detection

1. Decode the login JWT (three base64 segments). In vulnerable mode the payload has `sub`, `email`, `role` and **no `exp`**.
2. Call `/health` and confirm `"labMode": "vulnerable"`.
3. Semgrep rule `security-lab.jwt-ignore-expiration` flags `ignoreExpiration: true` in CI.
4. Automated tests: [tests/vulnerable/auth.vulnerable.test.ts](../tests/vulnerable/auth.vulnerable.test.ts) and [tests/secure/auth.secure.test.ts](../tests/secure/auth.secure.test.ts).

## Impact

A captured lab token (log file, reverse-proxy dump, copied header) remains usable **indefinitely** while the signing secret is unchanged. Logout on the client is cosmetic: the server still accepts the string.

## Root cause

`signVulnerableAccessToken` omits `expiresIn`. `verifyVulnerableAccessToken` sets `ignoreExpiration: true`. Authentication is treated as a one-time signature check instead of a time-bounded session.

## Remediation (already in `LAB_MODE=secure`)

- Sign with `expiresIn: 900` (15 minutes) and `algorithm: "HS256"`.
- Verify with `algorithms: ["HS256"]`, `ignoreExpiration: false`, `clockTolerance: 0`.
- Reject tokens that lack `exp`.
- Keep bcrypt.hash / bcrypt.compare and generic login errors (no user enumeration).
- Rotate `JWT_SECRET` to invalidate the unsigned-lifetime class of tokens if a secret leaks.

Refresh tokens, server-side revocation lists, and reuse detection are out of scope for this iteration; the secure mode is the minimum correct access-token control.

## What stays correct in both modes

- Passwords stored as bcrypt (cost 10 in seed)
- Same error for unknown email and wrong password (`Invalid credentials`)
- IDOR behaviour still isolated in `documentAuthz.ts` (WEB-001)
- Admin route still requires `ADMIN`
- `NODE_ENV=production` still refuses `LAB_MODE=vulnerable`

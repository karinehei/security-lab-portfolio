# Gitleaks

Detects credential-like strings in git history and the working tree.

## Policy

- **Fail** on anything that looks like a real secret.
- **Allow** only fictional lab placeholders listed in [`gitleaks.toml`](./gitleaks.toml), each justified in that file and in [`../exceptions.md`](../exceptions.md).

## Placeholders that are allowed (lab only)

| Value | Why it exists |
| --- | --- |
| `LabPassw0rd!` | Seed users for the local API. Documented in the lab README. Not a personal or production password. |
| `local-lab-jwt-secret-not-for-production` | Local HMAC key for lab JWTs. Must never be copied to a real environment. |

New strings (cloud keys, private keys, live tokens) must **not** be added to the allowlist. Rotate and purge them instead.

# Lab rules

These rules apply to every module in this repository. They are operational constraints, not slogans.

## 1. Local, owned targets only

Offensive steps (manual request tampering, mode comparison, authorization testing) are performed **only** against applications in this repository, running on localhost.

In-scope examples:

- `web-api-security/vulnerable-api` on `127.0.0.1`
- `ai-security-lab` in-process mock pipeline (no network)
- Future labs added under this tree and started with Docker Compose on loopback

Out of scope:

- Employer systems, customer systems, classmates' machines
- Public websites, cloud tenants, and internet-facing IPs
- TryHackMe *attack surface* beyond the platform's own assigned lab instances (platform notes belong in `tryhackme/` and stay on that platform)

## 2. Intentionally vulnerable means labelled and gated

A lab defect must be:

- named in the module README
- marked in source with `LAB VULNERABILITY`
- enabled only when `LAB_MODE=vulnerable`
- impossible to enable when `NODE_ENV=production`

Secure mode is the default in application code. Vulnerable mode is an explicit local choice.

## 3. No real secrets

Seed users, JWT secrets, and database passwords in this repository are **fiction for the lab**. They must never be production credentials, personal passwords, or keys copied from another environment.

## 4. No surprise exposure

- Publish container ports on `127.0.0.1`, not `0.0.0.0`.
- Do not deploy lab images to Kubernetes, ECS, or a public VM.
- Do not put the vulnerable API behind a real domain name.

## 5. Evidence stays proportionate

Reports may include example HTTP requests and responses for the local API. They must not include:

- exploits against other products
- credential dumps from real systems
- payload packs or malware
- instructions for attacking third parties

## 6. Close the loop

A module is incomplete until the workflow in [`methodology.md`](./methodology.md) is visible: insecure behaviour, assessment, fix, and tests.

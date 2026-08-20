# Trivy

Scans the **lab API image** built from `web-api-security/vulnerable-api/Dockerfile`. It does not scan registries or hosts we do not own.

## Policy

| Severity | CI |
| --- | --- |
| Critical, with a fix available | **Fail** (`--exit-code 1`, `--ignore-unfixed`) |
| High | Reported in logs; does not fail until listed as a must-fix in [`../exceptions.md`](../exceptions.md) |
| Unfixed upstream CVE | Ignored (`--ignore-unfixed`) so the lab is not blocked on a base-image issue we cannot patch in-tree |

The image is a **training artefact**. It must not be pushed to a public registry.

## Ignore file

[`.trivyignore`](./.trivyignore) is for dated, named exceptions only. An empty file means “no extra ignores yet”.

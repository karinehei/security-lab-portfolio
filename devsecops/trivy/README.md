# Trivy

Scans the **lab API image** built from `web-api-security/vulnerable-api/Dockerfile`. It does not scan registries or hosts we do not own.

## Policy

| Severity | CI |
| --- | --- |
| Critical, with a fix available | **Fail** (`--exit-code 1`, `--ignore-unfixed`) |
| High | Reported in logs; does not fail until listed as a must-fix in [`../exceptions.md`](../exceptions.md) |
| Unfixed upstream CVE | Ignored (`--ignore-unfixed`) so the lab is not blocked on a base-image issue we cannot patch in-tree |

The image is a **training artefact**. It must not be pushed to a public registry.

## CI invocation

GitHub Actions runs `aquasec/trivy:0.70.0` against the image just built on the runner (`docker run` + Docker socket). That matches Semgrep and Gitleaks and avoids `aquasecurity/trivy-action@0.29.0`, which no longer resolves: Aqua removed unprefixed tags after the March 2026 tag-poisoning incident. Do not pin `trivy:0.69.4` (malicious release).

Local filesystem scan: `make trivy` from the repository root (WSL).

## Ignore file

[`.trivyignore`](./.trivyignore) is for dated, named exceptions only. An empty file means “no extra ignores yet”.

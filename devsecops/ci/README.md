# CI

The live pipeline is [`.github/workflows/security.yml`](../../.github/workflows/security.yml). This folder holds helper scripts and operator notes.

## GitHub Actions

On push and pull request to `main`:

1. Checkout (full history for Gitleaks)
2. Node 20 + `npm ci` in `web-api-security/vulnerable-api`
3. API `typecheck`, Postgres, `test:all`
4. RAG lab `npm ci`, `typecheck`, `test:all`
5. Semgrep policy (must be clean at ERROR)
6. Semgrep lab coverage (WEB-001, WEB-002, RAG-ACL-001 patterns must still match)
7. API `npm run audit:ci`
8. Gitleaks with [`gitleaks.toml`](../gitleaks/gitleaks.toml)
9. `docker build` of the lab API
10. Trivy (Critical + fix available → fail)

No workflow file contains live credentials. Lab placeholders match `.env.example` and the Gitleaks allowlist.

## Local (WSL)

From the repository root, with Docker and Node 20:

```bash
cd /mnt/d/security-lab-portfolio/web-api-security/vulnerable-api
docker compose up -d db
cp -n .env.example .env
npm ci
npx prisma generate
npm run db:setup
npm run typecheck
npm run test:all
npm run audit:ci
```

Semgrep, Gitleaks, and Trivy match CI if the CLIs are installed, or via the same container images the workflow uses. Semgrep containers are invoked with `--entrypoint semgrep` plus `scan ...` because current Semgrep images do not treat a bare `scan` argument as the CLI. See [`run-local.sh`](./run-local.sh) for a best-effort wrapper (skips tools that are missing).

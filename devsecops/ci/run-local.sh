#!/usr/bin/env bash
# Best-effort local approximation of .github/workflows/security.yml (WSL).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
API="$ROOT/web-api-security/vulnerable-api"
cd "$ROOT"

echo "==> Typecheck and tests (requires local Postgres as in the lab README)"
if [[ -d "$API/node_modules" ]]; then
  (cd "$API" && npm run typecheck)
else
  echo "Skip typecheck: run npm ci in $API first"
fi

echo "==> Semgrep policy"
if command -v semgrep >/dev/null 2>&1; then
  semgrep scan --config "$ROOT/devsecops/semgrep/policy.yaml" --error --severity ERROR --metrics=off
  semgrep scan --config "$ROOT/devsecops/semgrep/lab-coverage.yaml" --json -o /tmp/semgrep-lab.json --metrics=off
  python3 "$ROOT/devsecops/ci/assert-lab-sast.py" /tmp/semgrep-lab.json
elif command -v docker >/dev/null 2>&1; then
  docker run --rm -v "$ROOT:/src" -w /src --entrypoint semgrep semgrep/semgrep:1.128.1 \
    scan --config /src/devsecops/semgrep/policy.yaml --error --severity ERROR --metrics=off
  docker run --rm -v "$ROOT:/src" -w /src --entrypoint semgrep semgrep/semgrep:1.128.1 \
    scan --config /src/devsecops/semgrep/lab-coverage.yaml --json -o /src/semgrep-lab.json --metrics=off
  python3 "$ROOT/devsecops/ci/assert-lab-sast.py" "$ROOT/semgrep-lab.json"
  rm -f "$ROOT/semgrep-lab.json"
else
  echo "Skip Semgrep: install semgrep or Docker"
fi

echo "==> Gitleaks"
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --source "$ROOT" --config "$ROOT/devsecops/gitleaks/gitleaks.toml"
elif command -v docker >/dev/null 2>&1; then
  docker run --rm -v "$ROOT:/repo" zricethezav/gitleaks:v8.24.0 \
    detect --source /repo --config /repo/devsecops/gitleaks/gitleaks.toml
else
  echo "Skip Gitleaks: install gitleaks or Docker"
fi

echo "==> npm audit"
if [[ -f "$API/package-lock.json" ]]; then
  (cd "$API" && npm run audit:ci)
fi

echo "Local wrapper finished. Trivy and full test:all are in the GitHub workflow."

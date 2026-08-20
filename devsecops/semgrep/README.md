# Semgrep

Two configs on purpose.

| File | Question CI answers |
| --- | --- |
| [`policy.yaml`](./policy.yaml) | “Did we introduce an **unintended** high-confidence issue?” — fail on ERROR |
| [`lab-coverage.yaml`](./lab-coverage.yaml) | “Do we still **see** the documented lab defects?” — fail if matches disappear |

## Expected findings

See [expected-findings.md](./expected-findings.md). Those hits are the training API, not a broken product build.

## Policy vs coverage

Policy rules **exclude** the known lab files for the IDOR and JWT patterns so the pipeline stays green while WEB-001 and WEB-002 exist. If the same pattern appears anywhere else, policy fails.

Lab-coverage rules **include** those files and must match. If someone “fixes” vulnerable mode by deleting the `LAB VULNERABILITY` branch without updating reports and tests, coverage fails — the lab would no longer demonstrate the finding.

#!/usr/bin/env python3
"""Fail if Semgrep lab-coverage did not see documented WEB-001 / WEB-002 / RAG-ACL-001 patterns."""

from __future__ import annotations

import json
import sys

REQUIRED_RULES = {
    "security-lab.idor-skip-ownership",
    "security-lab.jwt-ignore-expiration",
    "security-lab.rag-skip-ownership",
}


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: assert-lab-sast.py <semgrep-json>", file=sys.stderr)
        return 2

    with open(sys.argv[1], encoding="utf-8") as handle:
        payload = json.load(handle)

    results = payload.get("results", [])
    found: set[str] = set()
    for row in results:
        check_id = str(row.get("check_id") or "")
        found.add(check_id)
        for required in REQUIRED_RULES:
            if check_id == required or check_id.endswith("." + required):
                found.add(required)

    missing = REQUIRED_RULES - found

    if missing:
        print("Lab-coverage Semgrep rules missing matches:")
        for rule in sorted(missing):
            print(f"  - {rule}")
        print("If you removed a training defect, update reports and devsecops/semgrep/expected-findings.md.")
        return 1

    print("Lab-coverage OK:", ", ".join(sorted(REQUIRED_RULES)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

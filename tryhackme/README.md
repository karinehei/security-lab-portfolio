# TryHackMe learning

I recently started using TryHackMe to strengthen my practical cybersecurity skills. I use the platform alongside my own local security labs to practise security concepts and then apply them through implementation, remediation and automated testing.

This is **early, structured practice**, not a claim of extensive CTF or pentest experience. Rooms are recorded as completed in this repository only when a dated note exists **and** the same room is visible on the public profile.

**Public profile:** [https://tryhackme.com/p/karinehei](https://tryhackme.com/p/karinehei)

A recruiter should start at the [root README](../README.md), open the [portfolio page](../website/index.html) for a short summary, then use this folder for platform notes.

| What to check | Where |
| --- | --- |
| TryHackMe profile | [tryhackme.com/p/karinehei](https://tryhackme.com/p/karinehei) |
| Learning progress (planned vs completed) | [progress.md](./progress.md) |
| How platform learning connects to this repo | [skills-mapping.md](./skills-mapping.md) |
| Practical labs I own | [../web-api-security/vulnerable-api](../web-api-security/vulnerable-api), [../reports](../reports) |

---

## How platform study is used

```text
TryHackMe exercise
        ↓
Concept understood
        ↓
Own local security lab
        ↓
Vulnerability analysis
        ↓
Remediation
        ↓
Regression testing
```

TryHackMe is input (guided labs). This repository is output (code, reports, tests, CI). Completing a room is not the same as evidencing a skill here.

---

## Current learning status

**Recently started** (`[0x1][NEOPHYTE]`). I am actively building skills through practical labs and exercises. Four **introductory** Easy walkthrough rooms are marked **Completed** in [progress.md](./progress.md). Web application, OWASP, Linux, networking, and tooling rooms are still Planned.

**Snapshot: 20 August 2026** — completed rooms 4, streak 2, badges 1, rank Top 95%. These values change; the profile is the live source.

### Current areas of focus

These are learning and practice areas. A topic is **not** a completed TryHackMe badge unless [progress.md](./progress.md) says Completed.

| Area | In this repository today | TryHackMe in this repo |
| --- | --- | --- |
| Web application security | [WEB-001](../reports/WEB-001-broken-object-level-authorization.md) IDOR lab | Planned track |
| Penetration testing fundamentals | [methodology.md](../docs/methodology.md), [lab-rules.md](../docs/lab-rules.md), pentest-style reports | Intro: [Offensive Security Intro](./notes/offensive-security-intro.md); deeper path Planned |
| OWASP vulnerabilities | WEB-001 (API1 / BOLA), WEB-002 (A07 / API2) | Planned track |
| Authentication and authorization | [WEB-002](../reports/WEB-002-authentication-security.md), document ACL | Planned (covered by OWASP / web tracks) |
| API security | Local Express document API + tests | Planned (same tracks) |
| Linux and networking fundamentals | WSL + Docker Compose on loopback only — not a Linux/network course artefact | TODO — no room claimed |
| Security tooling | Semgrep, Gitleaks, npm audit, Trivy, GitHub Actions | TODO — no room claimed |

---

## What belongs in a note

Use [template.md](./template.md). Completed rooms will live under `notes/` as `notes/<room-slug>.md`.

Each note may include:

- room or module name and date
- topics and tools (by name, not as a recipe)
- concepts and practical skills in my own words
- how a developer should prevent the class of issue
- security implications at a design level
- a link to **this** repository’s lab or report, if one exists
- a link to the TryHackMe profile

## What never belongs in a note

- flags
- challenge passwords or hashes from THM machines
- exact question answers
- copy-pasted or paraphrased proprietary walkthroughs
- payloads meant to be reused against other systems
- anything that would violate [TryHackMe’s rules](https://tryhackme.com/r/legal)

If a sentence would let someone skip the room, it does not go in this repository.

---

## How notes are written

1. Finish the room **on TryHackMe** (their lab, their rules).
2. Copy [template.md](./template.md) to `notes/<room-slug>.md`.
3. Fill it from memory in my own words. No screenshots of flags.
4. Set status to **Completed** only when the profile and the note agree.
5. Add a row in [progress.md](./progress.md) and a line in [skills-mapping.md](./skills-mapping.md) if the concept maps to a lab in this repo.

Placeholder files under `notes/` are **planned tracks**, not completions.

---

## Layout

```text
tryhackme/
├── README.md              ← this page
├── progress.md            ← planned / in progress / completed
├── skills-mapping.md      ← THM concept → own lab → finding → fix → tests
├── template.md            ← copy for each completed room
└── notes/                 ← one file per room or learning track
```

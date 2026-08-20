# TryHackMe learning

Platform rooms are for **breadth**. This folder records what I took from them — concepts, tools, and how they map to labs I built myself. It is not a walkthrough archive.

A recruiter should start at the [root README](../README.md) (two-minute table), then use this folder for platform notes only.

| What to check | Where |
| --- | --- |
| TryHackMe profile | TODO: `https://tryhackme.com/p/<USERNAME>` |
| Learning progress (planned vs completed) | [progress.md](./progress.md) |
| How platform learning connects to this repo | [skills-mapping.md](./skills-mapping.md) |
| Practical labs I own | [../web-api-security/vulnerable-api](../web-api-security/vulnerable-api), [../reports](../reports) |

**Username / profile URL:** TODO — replace `<USERNAME>` when the public profile is ready. I do not list rooms as completed here until a dated note exists and the profile shows the same completion.

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
5. Add a row in [progress.md](./progress.md) and a line in [skills-mapping.md](./skills-mapping.md) if the concept maps to WEB-001, WEB-002, or CI.

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

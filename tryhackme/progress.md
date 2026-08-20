# Learning progress

Status in this table is the only completion claim I make in the repository. **Completed** requires a dated file in `notes/` **and** the same room visible on the public profile.

I recently started hands-on cybersecurity training with TryHackMe and am actively building my skills through practical labs and exercises. Completed rows below are **introductory Easy walkthrough rooms**, not unguided pentests.

**Public profile:** [https://tryhackme.com/p/karinehei](https://tryhackme.com/p/karinehei)

### Snapshot: 20 August 2026

Copied from the public profile on that date. These numbers change; the profile is the live source.

| Metric | Value on snapshot |
| --- | --- |
| Level | `[0x1][NEOPHYTE]` |
| Rank | Top 95% |
| Streak | 2 |
| Badges | 1 |
| Completed rooms | 4 |

| Room / Module | Area | Status | Skills Practised | Date |
| --- | --- | --- | --- | --- |
| [Offensive Security Intro](./notes/offensive-security-intro.md) | Penetration testing fundamentals (intro) | **Completed** | Authorised, in-scope offensive intro; walkthrough only | 2026-08-20 (profile snapshot) |
| [Defensive Security Intro](./notes/defensive-security-intro.md) | Defensive security (intro) | **Completed** | Guided intro to protecting systems; not a SOC claim | 2026-08-20 (profile snapshot) |
| [Inside a Computer System](./notes/inside-a-computer-system.md) | Computer fundamentals | **Completed** | Basic system components; not a Linux path | 2026-08-20 (profile snapshot) |
| [Careers in Cyber](./notes/careers-in-cyber.md) | Career overview | **Completed** | High-level job families; not a certification | 2026-08-20 (profile snapshot) |
| TODO: named TryHackMe web application room | Web application security | **Planned** | Access control, HTTP APIs — evidenced locally by [WEB-001](../reports/WEB-001-broken-object-level-authorization.md), not by a THM web room | TODO |
| TODO: named TryHackMe pentesting fundamentals room (beyond the intro above) | Penetration testing fundamentals | **Planned** | Scope, notes, localhost-only testing — [methodology.md](../docs/methodology.md) | TODO |
| TODO: named TryHackMe OWASP / API security room | OWASP vulnerabilities; API security; authentication and authorization | **Planned** | BOLA / IDOR, session TTL — [WEB-001](../reports/WEB-001-broken-object-level-authorization.md), [WEB-002](../reports/WEB-002-authentication-security.md) | TODO |
| TODO: named TryHackMe Linux room | Linux fundamentals | **Planned** | TODO after a completed Linux room — not claimed | TODO |
| TODO: named TryHackMe networking room | Networking fundamentals | **Planned** | TODO after a completed networking room — not claimed | TODO |
| TODO: named TryHackMe tooling room | Security tooling | **Planned** | Local evidence is CI scanners — [devsecops](../devsecops) | TODO |

Placeholder track notes (still not completions of those tracks): [web-application-security.md](./notes/web-application-security.md), [pentesting-fundamentals.md](./notes/pentesting-fundamentals.md), [owasp-related-training.md](./notes/owasp-related-training.md).

See also: [skills-mapping.md](./skills-mapping.md).

## Status values

| Status | Meaning |
| --- | --- |
| Planned | I intend to take this (or an equivalent named room). No completion evidence. |
| In progress | I have started on TryHackMe. Note may be partial. Profile may not show completion. |
| Completed | Profile shows the room; `notes/<slug>.md` has a date; no flags in the note. |

## When a room is finished

1. Duplicate [template.md](./template.md) into `notes/`.
2. Replace the TODO room name in this table and set status to Completed with a date.
3. Update [skills-mapping.md](./skills-mapping.md) if the concept already has a lab, or add a TODO if it does not.
4. Do not change [skills.md](../skills.md) to claim a TryHackMe badge until the note exists.

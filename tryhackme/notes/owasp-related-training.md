# OWASP-related training

Placeholder track — **not completed**. Replace this with a named TryHackMe OWASP / API-security room note when I finish it on the platform.

| Field | Value |
| --- | --- |
| **Room / module** | TODO: official room title (OWASP Top 10, API Top 10, or equivalent) |
| **Date** | TODO: YYYY-MM-DD |
| **Status** | **Planned** |
| **TryHackMe profile** | [https://tryhackme.com/p/karinehei](https://tryhackme.com/p/karinehei) |
| **Evidence** | None yet — do not treat this file as a completion |

## Topics

TODO after the room: which OWASP list (web vs API), which categories were covered at a high level. Do not paste the room’s question set.

## Tools used

TODO after the room: names only.

## Concepts learned

TODO after the room. Categories already implemented **here** (independent of THM completion):

- Broken object level authorisation (API1) — WEB-001
- Broken authentication / session expiration (A07 / API2) — WEB-002

Other Top 10 items remain out of scope until a lab exists.

## Practical skills

TODO after the room. Mapping a lecture name (for example “access control”) to a **function** in a codebase is the skill this portfolio cares about.

## Developer perspective

OWASP labels are for communication. The engineering artefact is a deny-by-default check, a short-lived token, and a test that fails if someone removes them.

## Security implications

Treating OWASP as a bingo card without object ACL or session TTL still ships a broken API. The local lab is there so those two controls are concrete.

## How this connects to my own lab

| This repository | Link |
| --- | --- |
| Lab | [vulnerable-api](../../web-api-security/vulnerable-api) |
| Finding / report | [WEB-001](../../reports/WEB-001-broken-object-level-authorization.md), [WEB-002](../../reports/WEB-002-authentication-security.md) |
| Tests | `tests/secure` and `tests/vulnerable`; CI Semgrep lab-coverage |

## Evidence / profile link

- Profile: [https://tryhackme.com/p/karinehei](https://tryhackme.com/p/karinehei)
- This track: Planned — see [progress.md](../progress.md)

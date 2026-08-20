# Web Application Security

Placeholder track — **not completed**. Replace this with a specific TryHackMe room note (copied from [template.md](../template.md)) when I finish a named web-app room and the profile shows it.

| Field | Value |
| --- | --- |
| **Room / module** | TODO: official room title (for example a TryHackMe web application path module) |
| **Date** | TODO: YYYY-MM-DD |
| **Status** | **Planned** |
| **TryHackMe profile** | TODO: `https://tryhackme.com/p/<USERNAME>` |
| **Evidence** | None yet — do not treat this file as a completion |

## Topics

TODO after the room: HTTP as an application protocol, cookies vs API tokens, input vs authorisation, common web risk categories. No room questions.

## Tools used

TODO after the room: names only (browser tools, proxy, HTTP client). No commands that solve the challenge.

## Concepts learned

TODO after the room, in my own words. Likely overlap with: the client is not a security boundary; identifiers in URLs must be authorised on the server.

## Practical skills

TODO after the room. Until then, the practical evidence for this *class* of issue in **this** repo is the local API lab, not TryHackMe.

## Developer perspective

For an Express/Prisma service I maintain, object-level checks belong in one function, not only in a list query. That is already implemented for documents:

- Lab: [vulnerable-api](../../web-api-security/vulnerable-api)
- Secure control: [`canReadDocument`](../../web-api-security/vulnerable-api/src/authz/documentAuthz.ts)

## Security implications

Missing object ACL leaks other users’ records. That is confidentiality of application data, not “I found a flag”.

## How this connects to my own lab

| This repository | Link |
| --- | --- |
| Lab | [web-api-security/vulnerable-api](../../web-api-security/vulnerable-api) |
| Finding / report | [WEB-001](../../reports/WEB-001-broken-object-level-authorization.md) |
| Tests | [idor.secure.test.ts](../../web-api-security/vulnerable-api/tests/secure/idor.secure.test.ts) |

The lab is independent of TryHackMe. Completing a THM web room later should **cite** this lab, not replace it.

## Evidence / profile link

- Profile: TODO: `https://tryhackme.com/p/<USERNAME>`
- This track: Planned — see [progress.md](../progress.md)

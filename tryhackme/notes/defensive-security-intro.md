# Defensive Security Intro

Introductory TryHackMe room — **Completed** as shown on the public profile. Easy / free / walkthrough. Introduction to protecting systems in a guided scenario. Not a SOC, blue-team, or detection-engineering claim.

| Field | Value |
| --- | --- |
| **Room / module** | Defensive Security Intro |
| **Date** | 2026-08-20 (visible on profile; snapshot) |
| **Status** | **Completed** |
| **TryHackMe profile** | [https://tryhackme.com/p/karinehei](https://tryhackme.com/p/karinehei) |
| **Evidence** | Profile “Completed rooms” list as of 20 August 2026 |

## Topics

- Defensive security as a counterpart to offensive intros
- That prevention and detection are different jobs from writing an exploit
- Guided scenario (classroom only)

## Tools used

Room walkthrough. No production SIEM or EDR claimed.

## Concepts learned

Defence is not only “patch later”. In software I maintain, defence is deny-by-default authorization, short-lived sessions, and tests that fail if those controls disappear.

## Practical skills

Complete a guided defensive intro. The practical defensive artefacts in **this** repository are secure lab modes and CI scanners, not this room’s scenario.

## Developer perspective

Secure mode in [documentAuthz.ts](../../web-api-security/vulnerable-api/src/authz/documentAuthz.ts) and [authService.ts](../../web-api-security/vulnerable-api/src/services/authService.ts) is the local equivalent of “the control is on by default”.

## Security implications

A walkthrough intro does not mean an organisation is monitored. CI (Semgrep, Gitleaks, Trivy) is the automation that exists here.

## How this connects to my own lab

| This repository | Link |
| --- | --- |
| Lab | [devsecops](../../devsecops) |
| Finding / report | [exceptions.md](../../devsecops/exceptions.md) (known lab defects vs policy) |
| Tests | [security.yml](../../.github/workflows/security.yml) |

## Evidence / profile link

- Profile: [https://tryhackme.com/p/karinehei](https://tryhackme.com/p/karinehei)
- Profile as of 20 August 2026

# Security policy

## Purpose of this repository

This repository is a **local cybersecurity training portfolio**. It includes intentionally vulnerable application code that exists only so authorization and secure-coding controls can be studied, remediated, and tested.

The vulnerable implementations are not product features. They are lab defects, gated by `LAB_MODE` and restricted to local development.

## Scope you can rely on

- Labs run on the operator's machine (Docker Compose / localhost / in-process RAG).
- Targets are applications **created in this repository**.
- Lab credentials are fictional and documented in each module README.
- No third-party host, cloud account, or production system is in scope.

## What must not happen

- Do not bind lab services to a public interface.
- Do not run `LAB_MODE=vulnerable` with `NODE_ENV=production`.
- Do not reuse lab passwords or JWT secrets anywhere else.
- Do not point scanners, fuzzers, or exploit tools at systems you do not own.

The process refuses to start in vulnerable mode when `NODE_ENV=production`. Docker Compose binds published ports to `127.0.0.1` only.

## Reporting issues

If you find an **unintended** defect in the *secure* implementation (for example, an authorization bypass that still works when `LAB_MODE=secure`), please open a GitHub issue with:

- module path
- `LAB_MODE` and `NODE_ENV`
- expected versus actual behaviour
- a request/response against **localhost only**

Do not file “findings” that merely restate an intentional lab vulnerability. Those are documented in [`reports/`](./reports) and in comments marked `LAB VULNERABILITY`.

There is no bug bounty attached to this repository.

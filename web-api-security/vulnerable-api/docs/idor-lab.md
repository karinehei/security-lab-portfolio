# IDOR / BOLA lab notes

First-iteration training issue for this API.

## Control gap

`GET /api/documents/:id` accepts any document primary key. In vulnerable mode the server does not ask whether the authenticated user is the owner.

Sequential integer IDs make the gap obvious (change `:id`). The same class of bug exists with UUIDs if the identifier is obtained from another channel; authorization must still be enforced on the object.

## Local check (vulnerable mode)

1. Start the stack with `LAB_MODE=vulnerable`.
2. `POST /api/auth/login` as `alice@local.lab`.
3. `POST /api/auth/login` as `bob@local.lab` and `POST /api/documents` as Bob, or use a seeded Bob document from `GET /api/documents` as Bob.
4. As Alice, `GET /api/documents/<bob-document-id>`.
5. Observe `200` and Bob's `content`.

## Local check (secure mode)

Repeat the same calls with `LAB_MODE=secure`. Alice must receive `403`. Bob and `admin@local.lab` still receive `200`.

## Assessment write-up

The professional report is [WEB-001](../../../reports/WEB-001-broken-object-level-authorization.md).

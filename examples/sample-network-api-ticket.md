# Login — failed API

Network-only card: no visible error toast, just the failed request in the draft.

```markdown
## Title
[Auth] /api/session fails with HTTP 401

## Description
On Sign in. The POST request to /api/session fails with HTTP 401.

Before that: Opened /login. Clicked “Sign in”.

## Steps to Reproduce
1. Opened /login.
2. Clicked “Sign in”.

## Actual Result
The POST request to /api/session fails with HTTP 401.

## Expected Result
This request should succeed.

## Severity
Minor

## Priority
Medium

## Labels
api, auth

## Environment
https://shop.test/login
```

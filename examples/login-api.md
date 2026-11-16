# Sign in: silent API failure

Sign in calls `POST /api/auth/session`, gets 500, and the page shows nothing. The password field is not recorded.

```markdown
## Title
[Auth] /api/auth/session fails with HTTP 500

## Description
On Sign in. The POST request to /api/auth/session fails with HTTP 500.

Before that: Opened the home page. Clicked “Sign in”. Opened the login page. Entered a value in the Email field. Clicked “Sign in”.

## Steps to Reproduce
1. Opened the home page.
2. Clicked “Sign in”.
3. Opened the login page.
4. Entered a value in the Email field.
5. Clicked “Sign in”.

## Actual Result
The POST request to /api/auth/session fails with HTTP 500.

## Expected Result
This request should succeed.

## Severity
Major

## Priority
High

## Labels
api, auth

## Environment
https://demo-toolshop.test/login
```

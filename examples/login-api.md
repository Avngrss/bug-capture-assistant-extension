# Sign in: silent API failure

Sign in calls `POST /api/auth/session`, gets 500, and the page shows nothing. The password field is not recorded.

```markdown
## Title
[Auth] /api/auth/session fails with HTTP 500

## Description
After clicking “Sign in”, the POST request to /api/auth/session fails with HTTP 500.

## Steps to Reproduce
1. Open the home page.
2. Click “Sign in”.
3. Open the login page.
4. Enter a value in the Email field.
5. Click “Sign in”.

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

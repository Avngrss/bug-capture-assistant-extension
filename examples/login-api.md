# Sign in: silent API failure

Sign in calls `POST /api/auth/session`, gets 500, and the page shows nothing. The password field is not recorded.

```markdown
## Title
[Auth] /api/auth/session fails with HTTP 500

## Description
After clicking “Sign in”, the POST request to /api/auth/session fails with HTTP 500.

## Steps to Reproduce
1. Open the home page.
2. Click “Sign in” and open the login page.
3. Enter “qa.user@example.com” in the Email field.
4. Click “Sign in”.

## Actual Result
The POST request to /api/auth/session fails with HTTP 500.

## Expected Result
The request should succeed (HTTP 2xx).

## Severity
Major

## Priority
High

## Labels
api, auth

## Environment
URL: https://demo-toolshop.test/login
Browser: Chrome 156
OS: Windows 10
```

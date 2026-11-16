# Account — promise rejection

Console-only defect after sign-in; description calls out an unhandled rejection.

```markdown
## Title
[Account] Failed to load user profile

## Description
On Your account. The browser console shows an error: “Failed to load user profile”.

Before that: Opened /login. Clicked “Sign in”. Opened /account.

Recorded from the DevTools Console. It is an unhandled promise rejection.

## Steps to Reproduce
1. Opened /login.
2. Clicked “Sign in”.
3. Opened /account.

## Actual Result
The browser console shows an error: “Failed to load user profile”.

## Expected Result
This console error should not occur.

## Severity
Minor

## Priority
Low

## Labels
console, account

## Environment
https://shop.test/account
```

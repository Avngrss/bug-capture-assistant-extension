# Settings: unhandled promise rejection

Save preferences throws inside an async handler. Nothing visible on the page, only the rejection in the console.

```markdown
## Title
[Account] Cannot read properties of undefined (reading 'theme')

## Description
After clicking “Save preferences” on Account settings, the browser console shows an error: “Cannot read properties of undefined (reading 'theme')”.

Recorded from the DevTools Console. It is an unhandled promise rejection.

## Steps to Reproduce
1. Open the home page.
2. Open the settings page.
3. Select the checkbox “Email me about new tools”.
4. Click “Save preferences”.

## Actual Result
The browser console shows an error: “Cannot read properties of undefined (reading 'theme')”.

## Expected Result
This console error should not occur.

## Severity
Minor

## Priority
Low

## Labels
console, account

## Environment
https://demo-toolshop.test/account/settings
```

# Settings: unhandled promise rejection

Save preferences throws inside an async handler. Nothing visible on the page, only the rejection in the console.

```markdown
## Title
[Account] Cannot read properties of undefined (reading 'theme')

## Description
On Account settings. The browser console shows an error: “Cannot read properties of undefined (reading 'theme')”.

Before that: Opened the home page. Opened the settings page. Selected the checkbox “Email me about new tools”. Clicked “Save preferences”.

Recorded from the DevTools Console. It is an unhandled promise rejection.

## Steps to Reproduce
1. Opened the home page.
2. Opened the settings page.
3. Selected the checkbox “Email me about new tools”.
4. Clicked “Save preferences”.

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

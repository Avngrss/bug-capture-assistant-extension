# Contact form: validation message

Invalid email, Send message. The form shows an inline `role="alert"` hint. Typed values are not stored, only the field name.

```markdown
## Title
[Contact] Enter a valid email address, e.g. name@example.com

## Description
After clicking “Send message” on Contact us, the page shows “Enter a valid email address, e.g. name@example.com”.

Shown as a page alert.

## Steps to Reproduce
1. Open the home page.
2. Open the contact page.
3. Enter a value in the Your email field.
4. Click “Send message”.

## Actual Result
The page shows “Enter a valid email address, e.g. name@example.com”.

## Expected Result
This message should not appear.

## Severity
Major

## Priority
High

## Labels
ui, contact

## Environment
https://demo-toolshop.test/contact
```

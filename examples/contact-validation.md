# Contact form: validation message

Invalid email, Send message. The form shows an inline `role="alert"` hint. Typed values are not stored, only the field name.

```markdown
## Title
[Contact] Enter a valid email address, e.g. name@example.com

## Description
On Contact us. The page shows “Enter a valid email address, e.g. name@example.com”.

Before that: Opened the home page. Opened the contact page. Entered a value in the Your email field. Clicked “Send message”.

Shown as a page alert.

## Steps to Reproduce
1. Opened the home page.
2. Opened the contact page.
3. Entered a value in the Your email field.
4. Clicked “Send message”.

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

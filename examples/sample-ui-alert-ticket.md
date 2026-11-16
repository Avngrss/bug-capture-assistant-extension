# Contact form — invalid field

Submit the contact form with a bad email. The ticket leads with the validation text, not a generic alert line.

```markdown
## Title
[Contact] Please enter a valid email address

## Description
On Contact us. The page shows “Please enter a valid email address”.

Before that: Opened /contact. Clicked in Message. Clicked “Send”.

Shown on a field marked invalid.

## Steps to Reproduce
1. Opened /contact.
2. Clicked in Message.
3. Clicked “Send”.

## Actual Result
The page shows “Please enter a valid email address”.

## Expected Result
This message should not appear.

## Severity
Major

## Priority
High

## Labels
ui, contact

## Environment
https://shop.test/contact
```

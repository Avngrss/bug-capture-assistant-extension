# Contact form: validation message

Invalid email, Send message. The form shows an inline `role="alert"` hint. Non-sensitive typed values appear in the steps.

```markdown
## Title
[Contact] Enter a valid email address, e.g. name@example.com

## Description
After clicking “Send message” on Contact us, the page shows “Enter a valid email address, e.g. name@example.com”.

Shown as a page alert.

## Steps to Reproduce
1. Open the home page.
2. Open the contact page.
3. Enter “qa.user-at-example” in the Your email field.
4. Enter “Where is my order?” in the Message field.
5. Click “Send message”.

## Actual Result
The page shows “Enter a valid email address, e.g. name@example.com”.

## Expected Result
The form should accept this input, or validation should match the entered data.

## Severity
Minor

## Priority
Medium

## Labels
ui, contact

## Environment
URL: https://demo-toolshop.test/contact
Browser: Chrome 156
OS: Windows 10
```

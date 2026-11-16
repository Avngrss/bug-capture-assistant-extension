# Checkout: payment fails

Pay sends `POST /api/payments`, the server answers 502, the page logs `console.error` and shows an alert. All three land in one card.

```markdown
## Title
[Checkout] Payment could not be processed. Please try again later.

## Description
After clicking “Pay” on Checkout, the page shows “Payment could not be processed. Please try again later.”

Shown as a page alert.

Also captured: The POST request to /api/payments fails with HTTP 502. The browser console shows an error: “Payment request failed with status 502”.

## Steps to Reproduce
1. Open the product page.
2. Click “Add to cart”.
3. Open the cart page.
4. Open the checkout page.
5. Click “Pay”.

## Actual Result
The page shows “Payment could not be processed. Please try again later.”

## Expected Result
The operation should complete without this error.

## Severity
Major

## Priority
High

## Labels
ui, console, api, checkout

## Environment
URL: https://demo-toolshop.test/checkout
Browser: Chrome 156
OS: Windows 10
```

# Checkout: payment fails

Pay sends `POST /api/payments`, the server answers 502, the page logs `console.error` and shows an alert. All three land in one card.

```markdown
## Title
[Checkout] Payment could not be processed. Please try again later.

## Description
On Checkout. The page shows “Payment could not be processed. Please try again later.”.

Before that: Opened the product page. Clicked “Add to cart”. Opened the cart page. Opened the checkout page. Clicked “Pay”.

Shown as a page alert.

Also captured: The POST request to /api/payments fails with HTTP 502. The browser console shows an error: “Payment request failed with status 502”.

## Steps to Reproduce
1. Opened the product page.
2. Clicked “Add to cart”.
3. Opened the cart page.
4. Opened the checkout page.
5. Clicked “Pay”.

## Actual Result
The page shows “Payment could not be processed. Please try again later.”.

## Expected Result
This message should not appear.

## Severity
Major

## Priority
High

## Labels
ui, console, api, checkout

## Environment
https://demo-toolshop.test/checkout
```

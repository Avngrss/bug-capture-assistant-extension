# Checkout — UI + console + failed API

Markdown from **Create ticket → Copy ticket** (v0.1).

```markdown
## Title
[Checkout] Payment unavailable

## Description
On Checkout. The page shows “Payment unavailable”.

Before that: Opened /cart. Clicked “Proceed to checkout”. Opened /checkout. Clicked “Pay”.

Shown as a page alert.

Also captured: The browser console shows an error: “Boom”. The POST request to /api/pay fails with HTTP 500.

## Steps to Reproduce
1. Opened /cart.
2. Clicked “Proceed to checkout”.
3. Opened /checkout.
4. Clicked “Pay”.

## Actual Result
The page shows “Payment unavailable”.

## Expected Result
This message should not appear.

## Severity
Major

## Priority
High

## Labels
ui, console, api, checkout

## Environment
https://shop.test/checkout
```

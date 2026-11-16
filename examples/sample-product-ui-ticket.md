# Example: product page UI alert (illustrative output)

Shows short environment URLs and readable steps instead of opaque product IDs. Analytics `/g/collect` failures are not dumped into the ticket when UI is the main defect.

```markdown
## Title
[Product] BCA second ui alert

## Description
On Combination Pliers. The page shows “BCA second ui alert”.

Before that: Opened the product page.

Shown as a page alert.

## Steps to Reproduce
1. Opened the product page.

## Actual Result
The page shows “BCA second ui alert”.

## Expected Result
This message should not appear.

## Severity
Major

## Priority
High

## Labels
ui, product

## Environment
https://practicesoftwaretesting.com/product/01M69B1HW8E19B80PAP2YK9WF0
```
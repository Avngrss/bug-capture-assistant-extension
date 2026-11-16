# Cart — console error

Markdown from **Create ticket → Copy ticket** (v0.1).

```markdown
## Title
[Cart] TypeError: Cannot read properties of undefined

## Description
On Cart. The browser console shows an error: “TypeError: Cannot read properties of undefined”.

Before that: Opened the product page. Clicked “Add to cart”. Opened /cart. Changed quantity to 2. Clicked “Update”.

Recorded from the DevTools Console. It is an uncaught page error. Seen 2 times in this session.

## Steps to Reproduce
1. Opened the product page.
2. Clicked “Add to cart”.
3. Opened /cart.
4. Changed quantity to 2.
5. Clicked “Update”.

## Actual Result
The browser console shows an error: “TypeError: Cannot read properties of undefined”.

## Expected Result
This console error should not occur.

## Severity
Minor

## Priority
Low

## Labels
console, cart

## Environment
https://shop.test/cart
```

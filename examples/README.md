# Examples

Each ticket here was produced by the built extension, not written by hand. A Playwright run loads `.output/chrome-mv3` into Chromium, clicks through a small local demo shop, then opens **Create ticket** in the side panel and saves the **Draft ticket** text as-is.

The only edit: the local server address (`http://127.0.0.1:<port>`) is replaced with `https://demo-toolshop.test`.

| File                                             | What happens on the page                                 |
| ------------------------------------------------ | -------------------------------------------------------- |
| [product-stock.md](./product-stock.md)           | Stock warning banner                                     |
| [checkout-payment.md](./checkout-payment.md)     | Alert + console error + HTTP 502 in one card             |
| [login-api.md](./login-api.md)                   | API returns 500, page shows nothing; password not stored |
| [contact-validation.md](./contact-validation.md) | Inline validation; non-sensitive values in steps         |
| [settings-rejection.md](./settings-rejection.md) | Unhandled promise rejection only                         |

Screenshots in `assets/` come from the same run.

Regenerate (private repo):

```bash
npm run build
SHOWCASE_EXPORT=1 npx playwright test tests/extension/showcase-export.spec.ts
```

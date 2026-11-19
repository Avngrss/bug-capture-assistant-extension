# Corner Shop: demo store for Bug Capture Assistant

A tiny online store with bugs planted on purpose. Use it to show or try the extension on something that looks like a real app.

There's no backend. The store's API runs in the browser as a Service Worker ([`sw.js`](./sw.js)), so the demo works offline and sends no data anywhere.

## Run it

**Locally** (Node.js 18+, no install):

```bash
node demo/serve.mjs
```

Open http://localhost:4173/. Use `--port 8080` for another port.

**Online:** once GitHub Pages is on for this repository (Settings → Pages → Deploy from a branch → `main`, `/ (root)`), the store is at `https://avngrss.github.io/bug-capture-assistant-extension/demo/`.

## Demo path

None of these bugs is obvious. Each one is something a tester misses, forgets, or reports wrongly without the extension.

Sign in with any email and password `demo1234`, start capture, then shop as usual:

| # | Page | Do this | What you notice | What really happened (the card) |
| - | ---- | ------- | --------------- | ------------------------------- |
| 1 | Shop | Search `men's watch` | "No products match". Looks like a normal empty result. Search `watch` finds the watch. | The search API crashed on the apostrophe: `GET /api/products` → HTTP 500. |
| 2 | Shop | Add *Wireless Headphones* (−30%), then a couple of other items | "Added to your cart", and the badge counts it. | `POST /api/cart/items` → HTTP 500, ignored by the page. In the cart the headphones are missing and the badge quietly drops back. The card points to the click on the shop page, screens earlier. |
| 3 | Cart | Click **+** on *Ceramic Mug* until it shows 3 | Something red flashes for a second. The quantity stays 3. | `PATCH /api/cart/items` → HTTP 409 (only 2 in stock), with the toast text and a screenshot taken while it was on screen. |
| 4 | Cart | Apply `WELCOME10`. Nothing happens, so click **Apply** again | The second click works: −10%. | The first click crashed: `TypeError` in the console. Every customer hits it on the first try. |
| 5 | Checkout | **Place order** | "Thank you! Your order is placed." | `POST /api/orders` → HTTP 500. There is no order. |

**Stop and review** shows a card for each. Open **Create ticket**: the steps lead to the exact click, even for the bug you noticed three screens later.

**Bonus, fitting the extension to a project:** on Checkout choose **Express courier**. The store shows its own red banner, which the default rules don't know, so there's no card. Add the rule in **Settings → Advanced UI issue rules** (Name `Store error banner`, CSS selector `.notice--error`), and the banner on the page gets its card at once.

Notes:

- Screenshots are taken for page alerts by default. Console and network screenshots can be turned on in **Settings**.
- Bugs more than 3 seconds apart get separate cards. Within 3 seconds on the same page they merge into one.
- **Reset demo** in the footer empties the cart and signs you out.

## Change the bugs

Every planted bug is marked `PLANTED BUG` in [`sw.js`](./sw.js) (API answers) and [`assets/pages/`](./assets/pages/) (page code).

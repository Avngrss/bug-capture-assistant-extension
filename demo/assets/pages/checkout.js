import {
  api,
  cartSubtotal,
  clearCart,
  el,
  formatPrice,
  getCart,
  pageUrl,
  renderChrome,
  wait,
} from '../app.js';

renderChrome('checkout');

const form = document.getElementById('checkout-form');
const lines = document.getElementById('order-lines');
const subtotalEl = document.getElementById('subtotal');
const deliveryEl = document.getElementById('delivery-price');
const totalEl = document.getElementById('total');
const noticeBox = document.getElementById('delivery-notice');
const placeOrder = document.getElementById('place-order');

let deliveryPrice = null;
let quoteRequest = 0;

function renderSummary() {
  const items = getCart();
  lines.replaceChildren(
    ...(items.length === 0
      ? [el('p', { class: 'muted small' }, 'Your cart is empty.')]
      : items.map((item) =>
          el(
            'div',
            { class: 'order-line' },
            el('span', {}, `${item.name} × ${item.quantity}`),
            el('span', {}, formatPrice(item.price * item.quantity)),
          ),
        )),
  );
  const subtotal = cartSubtotal();
  subtotalEl.textContent = formatPrice(subtotal);
  deliveryEl.textContent = deliveryPrice === null ? '—' : formatPrice(deliveryPrice);
  totalEl.textContent = formatPrice(subtotal + (deliveryPrice ?? 0));
  placeOrder.disabled = items.length === 0 || deliveryPrice === null;
}

async function quote(method) {
  const request = ++quoteRequest;
  noticeBox.replaceChildren();
  deliveryPrice = null;
  deliveryEl.textContent = '…';
  placeOrder.disabled = true;

  const response = await api(`delivery/quote?method=${method}`);
  const data = await response.json();
  if (request !== quoteRequest) return;

  if (data.price === null || data.price === undefined) {
    // The store's own error banner. It has no role="alert", so the
    // extension's default rules do not see it until you add a rule for
    // ".notice--error" in Settings → Advanced UI issue rules.
    noticeBox.replaceChildren(
      el(
        'div',
        { class: 'notice notice--error' },
        el('strong', {}, 'Delivery unavailable. '),
        "We couldn't calculate the express delivery price. Choose another delivery method.",
      ),
    );
  } else {
    deliveryPrice = data.price;
  }
  renderSummary();
}

form.addEventListener('change', (event) => {
  if (event.target.name === 'delivery') {
    quote(event.target.value);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  placeOrder.disabled = true;
  placeOrder.textContent = 'Placing your order…';

  // PLANTED BUG: the response status is never checked. The order request
  // fails with HTTP 500, yet the customer is sent to the confirmation page.
  await api('orders', {
    method: 'POST',
    body: {
      items: getCart(),
      delivery: form.delivery.value,
    },
  });
  await wait(1200);
  clearCart();
  location.href = pageUrl('order-confirmation/');
});

renderSummary();
quote(form.delivery.value);

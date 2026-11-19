import {
  api,
  cartSubtotal,
  el,
  formatPrice,
  getCart,
  pageUrl,
  renderChrome,
  saveCart,
  syncBadge,
  toast,
} from '../app.js';

renderChrome('cart');
// The cart page shows what the server saved and quietly resets the badge to it.
syncBadge();

const list = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const discountRow = document.getElementById('discount-row');
const discountEl = document.getElementById('discount');
const totalEl = document.getElementById('total');
const checkoutLink = document.getElementById('checkout-link');
const promoForm = document.getElementById('promo-form');
const promoInput = document.getElementById('promo');
const promoMessage = document.getElementById('promo-message');
const promoButton = promoForm.querySelector('button[type="submit"]');

let discountPercent = 0;
let summaryCache = null;

async function changeQuantity(id, delta) {
  const current = getCart().find((item) => item.id === id);
  if (current === undefined) return;
  const quantity = current.quantity + delta;

  // Optimistic UI: show the new quantity first, then tell the server.
  saveCart(
    getCart()
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0),
  );
  render();
  if (quantity <= 0) return;

  const response = await api('cart/items', {
    method: 'PATCH',
    body: { productId: id, quantity },
  });
  if (!response.ok) {
    // PLANTED BUG: the server refuses (only 2 in stock), the error flashes
    // for a moment, and the quantity on the page is not rolled back.
    toast("Couldn't update the quantity.", 'error', 1200);
  }
}

function cartRow(item) {
  const minus = el(
    'button',
    { class: 'qty-button', type: 'button', 'aria-label': `Decrease quantity: ${item.name}` },
    '−',
  );
  const plus = el(
    'button',
    { class: 'qty-button', type: 'button', 'aria-label': `Increase quantity: ${item.name}` },
    '+',
  );
  const remove = el(
    'button',
    { class: 'link-button', type: 'button', 'aria-label': `Remove: ${item.name}` },
    'Remove',
  );
  minus.addEventListener('click', () => changeQuantity(item.id, -1));
  plus.addEventListener('click', () => changeQuantity(item.id, 1));
  remove.addEventListener('click', () => changeQuantity(item.id, -item.quantity));

  return el(
    'div',
    { class: 'cart-row' },
    el('span', { class: 'thumb', style: { '--art': item.color }, 'aria-hidden': 'true' }, item.emoji),
    el(
      'div',
      { class: 'cart-row-info' },
      el('strong', {}, item.name),
      el('span', { class: 'muted small' }, `${formatPrice(item.price)} each`),
      remove,
    ),
    el('div', { class: 'qty' }, minus, el('span', { class: 'qty-value' }, String(item.quantity)), plus),
    el('strong', { class: 'cart-row-total' }, formatPrice(item.price * item.quantity)),
  );
}

function render() {
  const items = getCart();
  if (items.length === 0) {
    list.replaceChildren(
      el(
        'div',
        { class: 'empty' },
        el('p', {}, 'Your cart is empty.'),
        el('a', { class: 'btn btn-secondary', href: pageUrl('shop/') }, 'Browse products'),
      ),
    );
    checkoutLink.classList.add('is-disabled');
    checkoutLink.setAttribute('aria-disabled', 'true');
  } else {
    list.replaceChildren(...items.map(cartRow));
    checkoutLink.classList.remove('is-disabled');
    checkoutLink.removeAttribute('aria-disabled');
  }

  const subtotal = cartSubtotal();
  const discount = (subtotal * discountPercent) / 100;
  subtotalEl.textContent = formatPrice(subtotal);
  discountRow.hidden = discount === 0;
  discountEl.textContent = `−${formatPrice(discount)}`;
  totalEl.textContent = formatPrice(subtotal - discount);
}

async function loadSummary() {
  const response = await api('cart/summary', {
    method: 'POST',
    body: { items: getCart() },
  });
  summaryCache = await response.json();
  return summaryCache;
}

checkoutLink.addEventListener('click', (event) => {
  if (checkoutLink.getAttribute('aria-disabled') === 'true') {
    event.preventDefault();
  }
});

promoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const code = promoInput.value.trim();
  promoMessage.textContent = '';
  promoMessage.className = 'field-hint';
  promoInput.removeAttribute('aria-invalid');
  if (code === '') {
    promoInput.focus();
    return;
  }

  promoButton.disabled = true;
  promoButton.textContent = 'Applying…';
  try {
    const response = await api('promo/apply', { method: 'POST', body: { code } });
    const result = await response.json();
    if (!result.valid) {
      promoInput.setAttribute('aria-invalid', 'true');
      promoMessage.textContent = `“${code}” is not a valid promo code.`;
      promoMessage.className = 'field-hint field-hint--error';
      return;
    }
    // PLANTED BUG: a missing await. On the first click the summary is not
    // cached yet, `summary` is a pending Promise, and the next line throws.
    // By the second click the summary has loaded, so it works, and the first
    // failure looks like a one-off glitch.
    const summary = summaryCache ?? loadSummary();
    const subtotal = summary.totals.subtotal;
    discountPercent = result.discount.percent;
    promoMessage.textContent = `${result.code} applied: −${discountPercent}% on ${formatPrice(subtotal)}.`;
    promoMessage.className = 'field-hint field-hint--success';
    render();
  } finally {
    promoButton.disabled = false;
    promoButton.textContent = 'Apply';
  }
});

render();

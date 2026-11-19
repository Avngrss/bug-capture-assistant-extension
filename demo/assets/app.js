// Shared code for every Corner Shop page: mock API start-up, cart and user
// state, header, footer and toasts.

export const demoRoot = new URL('../', import.meta.url);

const CART_KEY = 'cornershop.cart';
const BADGE_KEY = 'cornershop.badge';
const USER_KEY = 'cornershop.user';

export function pageUrl(path) {
  return new URL(path, demoRoot).href;
}

// ---------------------------------------------------------------- mock API

let mockApiReady;

function startMockApi() {
  if (!('serviceWorker' in navigator)) {
    return Promise.reject(
      new Error('This browser cannot run the demo API (no Service Workers).'),
    );
  }
  return navigator.serviceWorker
    .register(new URL('sw.js', demoRoot).href, { scope: demoRoot.href })
    .then(() => navigator.serviceWorker.ready)
    .then(() => {
      if (navigator.serviceWorker.controller) {
        return undefined;
      }
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('The demo API did not start. Reload the page.'));
        }, 5000);
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => {
            clearTimeout(timer);
            resolve();
          },
          { once: true },
        );
      });
    });
}

export function mockApi() {
  mockApiReady ??= startMockApi();
  return mockApiReady;
}

export async function api(path, { method = 'GET', body } = {}) {
  await mockApi();
  return fetch(new URL(`api/${path}`, demoRoot).href, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

// ------------------------------------------------------------------- state

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked; the demo still works within the page.
  }
}

export function getCart() {
  const items = readJson(CART_KEY, []);
  return Array.isArray(items) ? items : [];
}

// The cart holds what the server saved. The header badge is optimistic: the
// shop page counts an item the moment it is clicked, and the cart page sets
// the badge back to the saved cart when it opens.

function readBadge() {
  const value = readJson(BADGE_KEY, null);
  return typeof value === 'number' ? value : null;
}

export function bumpBadge() {
  writeJson(BADGE_KEY, (readBadge() ?? cartCount()) + 1);
  updateCartBadge();
}

export function syncBadge() {
  writeJson(BADGE_KEY, cartCount());
  updateCartBadge();
}

export function saveCart(items) {
  writeJson(CART_KEY, items);
  syncBadge();
}

export function addToCart(product) {
  const items = getCart();
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      color: product.color,
      quantity: 1,
    });
  }
  writeJson(CART_KEY, items);
  updateCartBadge();
}

export function clearCart() {
  saveCart([]);
}

export function cartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getUser() {
  return readJson(USER_KEY, null);
}

export function setUser(user) {
  writeJson(USER_KEY, user);
}

export function resetDemo() {
  try {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(BADGE_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Nothing to reset.
  }
}

// ---------------------------------------------------------------- helpers

export function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

export function el(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined || value === null || value === false) continue;
    if (name === 'style' && typeof value === 'object') {
      for (const [prop, propValue] of Object.entries(value)) {
        node.style.setProperty(prop, propValue);
      }
    } else {
      node.setAttribute(name, value === true ? '' : String(value));
    }
  }
  node.append(...children.flat().filter((child) => child !== null && child !== undefined));
  return node;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------------------------------------- header and footer

const BAG_ICON = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M7 7V6a5 5 0 0 1 10 0v1h2.2a1 1 0 0 1 1 .92l1 12A2 2 0 0 1 19.2 22H4.8a2 2 0 0 1-2-2.08l1-12A1 1 0 0 1 4.8 7H7Zm2 0h6V6a3 3 0 0 0-6 0v1Zm-2 3a1 1 0 1 0 2 0 1 1 0 0 0-2 0Zm8 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"/></svg>`;

function updateCartBadge() {
  const badge = document.querySelector('[data-cart-count]');
  if (!badge) return;
  const count = readBadge() ?? cartCount();
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

export function renderChrome(activePage) {
  const header = document.getElementById('site-header');
  if (header) {
    const user = getUser();
    const logo = el('a', { class: 'logo', href: pageUrl('shop/') });
    logo.innerHTML = `${BAG_ICON}<span>Corner Shop</span>`;
    const nav = el(
      'nav',
      { class: 'site-nav', 'aria-label': 'Main' },
      el(
        'a',
        { href: pageUrl('shop/'), 'aria-current': activePage === 'shop' ? 'page' : undefined },
        'Shop',
      ),
      el(
        'a',
        {
          href: pageUrl('cart/'),
          'aria-label': 'Cart',
          'aria-current': activePage === 'cart' ? 'page' : undefined,
        },
        'Cart',
        el('span', { class: 'cart-badge', 'data-cart-count': true, 'aria-hidden': 'true' }),
      ),
      user
        ? el('span', { class: 'user-chip', title: user.email }, user.name ?? user.email)
        : el(
            'a',
            {
              href: pageUrl('sign-in/'),
              'aria-current': activePage === 'sign-in' ? 'page' : undefined,
            },
            'Sign in',
          ),
    );
    header.replaceChildren(el('div', { class: 'container header-inner' }, logo, nav));
    updateCartBadge();
  }

  const footer = document.getElementById('site-footer');
  if (footer) {
    const reset = el('button', { class: 'link-button', type: 'button' }, 'Reset demo');
    reset.addEventListener('click', () => {
      resetDemo();
      location.href = pageUrl('sign-in/');
    });
    footer.replaceChildren(
      el(
        'div',
        { class: 'container footer-inner' },
        el(
          'p',
          {},
          'Corner Shop is a demo store for ',
          el(
            'a',
            { href: 'https://github.com/Avngrss/bug-capture-assistant-extension' },
            'Bug Capture Assistant',
          ),
          '. Some things here are broken on purpose.',
        ),
        reset,
      ),
    );
  }

  mockApi().catch((error) => {
    toast(error.message, 'warning');
  });
}

// ------------------------------------------------------------------ toasts

function toastRegion() {
  let region = document.querySelector('.toast-region');
  if (!region) {
    region = el('div', { class: 'toast-region' });
    document.body.append(region);
  }
  return region;
}

// Error toasts use role="alert", like most real apps; success toasts use
// role="status" and are not treated as problems.
export function toast(message, kind = 'success', durationMs = 4500) {
  const node = el(
    'div',
    { class: `toast toast--${kind}`, role: kind === 'error' ? 'alert' : 'status' },
    message,
  );
  toastRegion().append(node);
  setTimeout(() => node.classList.add('toast--leaving'), durationMs);
  setTimeout(() => node.remove(), durationMs + 400);
}

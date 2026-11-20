// Mock API for the Corner Shop demo.
// It runs in the browser as a Service Worker, so the demo needs no backend:
// every request to <demo root>/api/* is answered here.
// The planted bugs are marked with "PLANTED BUG". Each one is easy to miss
// by eye; see README.md for what the tester sees and what really happens.

const PRODUCTS = [
  {
    id: 'headphones',
    name: 'Wireless Headphones',
    price: 59,
    oldPrice: 84,
    stock: 12,
    emoji: '🎧',
    color: '#e8eefc',
  },
  {
    id: 'mug',
    name: 'Ceramic Mug',
    price: 12,
    stock: 2,
    emoji: '☕',
    color: '#fbefe3',
  },
  {
    id: 'backpack',
    name: 'Canvas Backpack',
    price: 45,
    stock: 8,
    emoji: '🎒',
    color: '#e6f4ec',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    price: 29,
    stock: 15,
    emoji: '🕶️',
    color: '#f3e8f7',
  },
  {
    id: 'watch',
    name: 'Smart Watch',
    price: 119,
    stock: 5,
    emoji: '⌚',
    color: '#e9f3f6',
  },
  {
    id: 'notebook',
    name: 'Linen Notebook',
    price: 9,
    stock: 30,
    emoji: '📓',
    color: '#f6f1e2',
  },
];

const DEMO_PASSWORD = 'demo1234';

const STATUS_TEXT = {
  200: 'OK',
  201: 'Created',
  401: 'Unauthorized',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
};

const API_PREFIX = new URL('api/', self.registration.scope).pathname;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (
    url.origin !== self.location.origin ||
    !url.pathname.startsWith(API_PREFIX)
  ) {
    return;
  }
  const route = url.pathname.slice(API_PREFIX.length);
  event.respondWith(handle(event.request, route, url.searchParams));
});

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    statusText: STATUS_TEXT[status] ?? '',
    headers: { 'Content-Type': 'application/json' },
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function findProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

async function handle(request, route, query) {
  await wait(250 + Math.round(Math.random() * 200));
  const method = request.method;

  if (method === 'POST' && route === 'auth/login') {
    const { email, password } = await readBody(request);
    if (password !== DEMO_PASSWORD) {
      // Expected behaviour, not a bug: a wrong password is rejected.
      return json(401, { error: 'invalid_credentials' });
    }
    return json(200, {
      token: crypto.randomUUID(),
      user: { email: String(email ?? ''), name: 'Alex Morgan' },
    });
  }

  if (method === 'GET' && route === 'products') {
    const search = (query.get('q') ?? '').trim().toLowerCase();
    if (search.includes("'")) {
      // PLANTED BUG: the search query is pasted into SQL unescaped, so an
      // apostrophe ("men's watch") breaks it. The shop page shows the failure
      // as an ordinary "nothing found".
      return json(500, {
        error: 'search_failed',
        message: 'syntax error at or near "s"',
      });
    }
    const words = search.split(/\s+/).filter(Boolean);
    const products = PRODUCTS.filter((product) =>
      words.every((word) => product.name.toLowerCase().includes(word)),
    );
    return json(200, { products });
  }

  if (method === 'POST' && route === 'cart/items') {
    const { productId } = await readBody(request);
    if (productId === 'headphones') {
      // PLANTED BUG: the discounted product is never saved to the cart.
      // The shop page has already said "added" and counted it in the badge.
      return json(500, {
        error: 'pricing_failed',
        message: 'Discount rule SALE-30 not found',
      });
    }
    if (findProduct(productId) === undefined) {
      return json(404, { error: 'product_not_found' });
    }
    return json(201, { productId, quantity: 1 });
  }

  if (method === 'PATCH' && route === 'cart/items') {
    const { productId, quantity } = await readBody(request);
    const product = findProduct(productId);
    if (product === undefined) {
      return json(404, { error: 'product_not_found' });
    }
    if (Number(quantity) > product.stock) {
      // Correct answer from the server. The bug is on the cart page: it
      // flashes an error for a moment and keeps the quantity anyway.
      return json(409, { error: 'insufficient_stock', available: product.stock });
    }
    return json(200, { productId, quantity });
  }

  if (method === 'POST' && route === 'cart/summary') {
    const { items } = await readBody(request);
    const subtotal = (Array.isArray(items) ? items : []).reduce(
      (sum, item) =>
        sum + (findProduct(item.id)?.price ?? 0) * Number(item.quantity ?? 0),
      0,
    );
    return json(200, { totals: { subtotal } });
  }

  if (method === 'POST' && route === 'promo/apply') {
    const { code } = await readBody(request);
    const normalized = String(code ?? '')
      .trim()
      .toUpperCase();
    if (normalized === 'WELCOME10') {
      return json(200, {
        code: normalized,
        valid: true,
        discount: { percent: 10 },
      });
    }
    return json(200, { code: normalized, valid: false });
  }

  if (method === 'GET' && route === 'delivery/quote') {
    if (query.get('method') === 'express') {
      // Bonus: the courier service returns no price, and the page shows the
      // store's own banner, which the default rules do not know.
      return json(200, { method: 'express', price: null, eta: null });
    }
    return json(200, {
      method: 'standard',
      price: 4.99,
      eta: '3–5 business days',
    });
  }

  if (method === 'POST' && route === 'orders') {
    // PLANTED BUG: every order fails, and the checkout page never checks the
    // status, so the customer still sees the confirmation page.
    return json(500, { error: 'payment_gateway_timeout' });
  }

  if (method === 'POST' && route === 'newsletter') {
    await wait(400);
    // PLANTED BUG: the mail service is down, but the API still answers
    // HTTP 200 and puts the failure in the body. In the Network tab the
    // request looks fine; the page checks only the status and celebrates.
    return json(200, { success: false, error: 'Mail service unavailable' });
  }

  return json(404, { error: 'not_found' });
}

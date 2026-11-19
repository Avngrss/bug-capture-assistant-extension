import {
  addToCart,
  api,
  bumpBadge,
  el,
  formatPrice,
  renderChrome,
  toast,
} from '../app.js';

renderChrome('shop');

const grid = document.getElementById('products');
const countLabel = document.getElementById('product-count');
const heading = document.getElementById('results-heading');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');

function productCard(product) {
  const discount =
    product.oldPrice === undefined
      ? null
      : Math.round((1 - product.price / product.oldPrice) * 100);

  const button = el(
    'button',
    {
      class: 'btn btn-primary',
      type: 'button',
      'aria-label': `Add to cart: ${product.name}`,
    },
    'Add to cart',
  );

  button.addEventListener('click', async () => {
    // Optimistic UI: count the item and confirm at once, save in the background.
    bumpBadge();
    toast(`${product.name} added to your cart.`, 'success', 2500);
    button.disabled = true;
    button.textContent = 'Added ✓';
    setTimeout(() => {
      button.disabled = false;
      button.textContent = 'Add to cart';
    }, 900);

    const response = await api('cart/items', {
      method: 'POST',
      body: { productId: product.id, quantity: 1 },
    });
    if (response.ok) {
      addToCart(product);
    }
    // PLANTED BUG: a failed save is ignored. No message, and the badge keeps
    // counting the item. The customer finds out on the cart page, if at all.
  });

  return el(
    'article',
    { class: 'product-card' },
    el(
      'div',
      { class: 'product-art', style: { '--art': product.color } },
      el('span', { class: 'product-emoji', 'aria-hidden': 'true' }, product.emoji),
      discount === null ? null : el('span', { class: 'badge badge--sale' }, `−${discount}%`),
    ),
    el(
      'div',
      { class: 'product-body' },
      el('h3', {}, product.name),
      el(
        'p',
        { class: 'price' },
        el('strong', {}, formatPrice(product.price)),
        product.oldPrice === undefined ? null : el('s', {}, formatPrice(product.oldPrice)),
      ),
      button,
    ),
  );
}

function emptyState(query) {
  const showAll = el('button', { class: 'btn btn-secondary', type: 'button' }, 'Show all products');
  showAll.addEventListener('click', () => {
    searchInput.value = '';
    loadProducts('');
  });
  return el(
    'div',
    { class: 'empty card' },
    el('p', {}, `No products match “${query}”.`),
    el('p', { class: 'muted small' }, 'Check the spelling or try a shorter search.'),
    showAll,
  );
}

async function loadProducts(query) {
  grid.replaceChildren(el('p', { class: 'muted' }, 'Loading products…'));
  heading.textContent = query === '' ? 'All products' : `Results for “${query}”`;
  const path = query === '' ? 'products' : `products?q=${encodeURIComponent(query)}`;
  const response = await api(path);

  // PLANTED BUG: any failed response is shown as "nothing found". The search
  // API crashes on an apostrophe, and the page tells the customer there are
  // simply no such products.
  const products = response.ok ? (await response.json()).products : [];

  countLabel.textContent = `${products.length} ${products.length === 1 ? 'item' : 'items'}`;
  if (products.length === 0) {
    grid.replaceChildren(emptyState(query));
    return;
  }
  grid.replaceChildren(...products.map(productCard));
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loadProducts(searchInput.value.trim());
});

loadProducts('').catch((error) => {
  grid.replaceChildren(el('p', { class: 'muted' }, String(error.message ?? error)));
});

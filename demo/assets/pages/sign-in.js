import { api, el, pageUrl, renderChrome, setUser } from '../app.js';

renderChrome('sign-in');

const form = document.getElementById('sign-in-form');
const errorBox = document.getElementById('form-error');
const submit = form.querySelector('button[type="submit"]');

function showError(message) {
  errorBox.replaceChildren(el('div', { class: 'form-alert', role: 'alert' }, message));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.replaceChildren();
  const email = form.email.value.trim();
  const password = form.password.value;

  submit.disabled = true;
  submit.textContent = 'Signing in…';
  try {
    const response = await api('auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (response.status === 401) {
      showError('Incorrect email or password.');
      return;
    }
    if (!response.ok) {
      showError('Something went wrong. Please try again.');
      return;
    }
    const { user } = await response.json();
    setUser(user);
    location.href = pageUrl('shop/');
  } finally {
    submit.disabled = false;
    submit.textContent = 'Sign in';
  }
});

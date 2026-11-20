import { api, getUser, renderChrome } from '../app.js';

renderChrome('order-confirmation');

const form = document.getElementById('newsletter-form');
const email = document.getElementById('newsletter-email');
const message = document.getElementById('newsletter-message');
const button = form.querySelector('button[type="submit"]');

email.value = getUser()?.email ?? '';

function showMessage(text, kind) {
  message.textContent = text;
  message.className = kind === undefined ? 'field-hint' : `field-hint field-hint--${kind}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (email.value.trim() === '') {
    showMessage('Enter your email to get the code.');
    email.focus();
    return;
  }

  button.disabled = true;
  showMessage('Subscribing…');
  const response = await api('newsletter', {
    method: 'POST',
    body: { email: email.value.trim() },
  });
  button.disabled = false;

  // PLANTED BUG: only the HTTP status is checked. The API answers 200 even
  // when the mail service is down and puts the failure in the body, so the
  // customer is told the code is on its way. DevTools shows a green 200 too.
  if (response.ok) {
    showMessage("You're subscribed! Your 10% code is on its way.", 'success');
    return;
  }
  showMessage("Couldn't subscribe. Try again later.");
});

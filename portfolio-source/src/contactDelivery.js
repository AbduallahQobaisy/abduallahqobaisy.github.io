export function validFormspreeEndpoint(value) {
  return /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(value || '');
}

export async function sendContact(formData, endpoint, {fetchImpl = fetch, signal} = {}) {
  if (!validFormspreeEndpoint(endpoint)) {
    throw new Error('Email delivery is not connected yet. Please use the email link below.');
  }
  const response = await fetchImpl(endpoint, {
    method: 'POST',
    body: formData,
    headers: {Accept: 'application/json'},
    signal,
  });
  if (!response.ok) {
    throw new Error(response.status === 429
      ? 'Too many attempts. Please wait a moment and try again.'
      : 'Your message could not be sent. Please try again or use the email link below.');
  }
}

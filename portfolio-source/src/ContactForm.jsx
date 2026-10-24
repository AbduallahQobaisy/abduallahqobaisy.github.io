import React, {useState} from 'react';
import {sendContact, validFormspreeEndpoint} from './contactDelivery';

export default function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
  const connected = validFormspreeEndpoint(endpoint);

  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('_gotcha')) return;
    setStatus('sending');
    setMessage('');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      await sendContact(data, endpoint, {signal: controller.signal});
      setStatus('success');
      setMessage('Message sent. Thanks for getting in touch!');
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error.name === 'AbortError'
        ? 'Sending took too long. Please try again or use the email link below.'
        : error instanceof TypeError
          ? 'Could not connect. Check your connection and try again.'
          : error.message);
    } finally {
      clearTimeout(timeout);
    }
  }

  return <form className="contact-form glass" onSubmit={submit} aria-labelledby="contact-form-title" aria-busy={status === 'sending'}>
    <div className="form-heading"><h3 id="contact-form-title">Tell me what you have in mind.</h3><p>A few details are a good place to start.</p></div>
    <div className="form-row">
      <label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Name" disabled={status === 'sending'}/></label>
      <label htmlFor="contact-email">Your email<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" disabled={status === 'sending'}/></label>
    </div>
    <label htmlFor="contact-subject">What’s this about?<input id="contact-subject" name="subject" required maxLength={140} placeholder="A project, a question, an idea…" disabled={status === 'sending'}/></label>
    <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Tell me a little about it." disabled={status === 'sending'}/></label>
    <div className="form-trap" aria-hidden="true"><label>Leave this empty<input name="_gotcha" tabIndex={-1} autoComplete="off"/></label></div>
    <input type="hidden" name="_subject" value="New enquiry from your portfolio"/>
    {!connected && <p className="form-preview-note">Local preview — email delivery is not connected yet.</p>}
    <div className="form-actions"><p>Your details are only used to respond to your enquiry.</p><button className="button primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">↗</span></button></div>
    <p id="contact-form-status" className={'form-status ' + status} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">{message}</p>
  </form>;
}

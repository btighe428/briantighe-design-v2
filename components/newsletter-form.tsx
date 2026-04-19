'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'submitting' | 'ok' | 'error';

export function NewsletterForm({
  label = 'Email',
  cta = 'Subscribe',
}: {
  label?: string;
  cta?: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (res.ok && json.ok) {
        setStatus('ok');
        setMessage(json.message ?? 'Subscribed.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(json.message ?? 'Could not subscribe right now.');
      }
    } catch {
      setStatus('error');
      setMessage('Could not subscribe right now.');
    }
  }

  return (
    <form
      method="post"
      action="/api/subscribe"
      onSubmit={onSubmit}
      noValidate
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: '0.75rem',
        maxWidth: '36rem',
      }}
    >
      <label htmlFor="newsletter-email" className="sc" style={{ flex: '0 0 100%' }}>
        {label}
      </label>
      <input
        type="email"
        name="email"
        id="newsletter-email"
        required
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={status === 'submitting'}
        style={{
          flex: '1 1 16rem',
          padding: '0.6rem 0.9rem',
          fontFamily: 'inherit',
          fontSize: '1.05rem',
          border: '1px solid var(--color-rule)',
          background: 'var(--color-paper)',
          color: 'var(--color-ink)',
        }}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          padding: '0.6rem 1.2rem',
          fontFamily: 'inherit',
          fontSize: '1rem',
          border: '1px solid var(--color-ink)',
          background: 'var(--color-ink)',
          color: 'var(--color-paper)',
          cursor: status === 'submitting' ? 'wait' : 'pointer',
        }}
      >
        {status === 'submitting' ? 'Subscribing…' : cta}
      </button>
      {status !== 'idle' && status !== 'submitting' ? (
        <p
          role="status"
          aria-live="polite"
          className="essay-meta"
          style={{ flex: '0 0 100%', marginTop: '0.25rem' }}
        >
          {status === 'ok' ? 'Subscribed. Check your inbox.' : message}
        </p>
      ) : null}
    </form>
  );
}

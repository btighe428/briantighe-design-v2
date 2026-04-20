'use client';

import { useActionState } from 'react';
import { subscribe, type SubscribeState } from '@/app/actions/subscribe';

const initial: SubscribeState = null;

export function SubscribeForm({
  source = 'homepage',
}: {
  source?: string;
}) {
  const [state, formAction, pending] = useActionState(subscribe, initial);
  const done = state?.ok === true;

  return (
    <form action={formAction} className="subscribe-form" aria-live="polite">
      <label htmlFor="subscribe-email" className="sr-only">
        Email address
      </label>
      <input
        id="subscribe-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@wherever"
        disabled={pending || done}
        aria-describedby="subscribe-message"
      />
      <input type="hidden" name="source" value={source} />
      <button type="submit" disabled={pending || done}>
        {pending ? '…' : done ? 'Subscribed' : 'Subscribe'}
      </button>
      <p
        id="subscribe-message"
        className="subscribe-message"
        role={state?.ok === false ? 'alert' : undefined}
      >
        {state?.message ??
          'One essay every Monday. No tracking beyond Vercel. Unsubscribe replies the same way.'}
      </p>
    </form>
  );
}

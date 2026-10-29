'use client';

import { useId, useState } from 'react';
import { Icon } from './Icons';

const inputCls =
  'w-full rounded-xl bg-paper px-4 py-3 font-display text-base text-ink placeholder:text-muted aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-offset-0 aria-[invalid=true]:outline-[var(--ink)]';

const TOPICS = [
  { value: 'suggestion', label: 'Suggest a startup' },
  { value: 'contact', label: 'Something else' },
];

/** Contact form. Posts to the public API, which stores the message for the admin inbox (rate limited there). */
export function ContactForm({ apiUrl, initialTopic = 'contact' }) {
  const id = useId();
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [topic, setTopic] = useState(initialTopic);

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      kind: topic,
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      message: String(form.get('message') ?? '').trim(),
      website: String(form.get('website') ?? ''), // honeypot
    };

    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errs.email = 'Please enter an email address so we can reply.';
    if (body.message.length < 10) errs.message = 'Please write at least 10 characters.';
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('sending');
    setError('');
    try {
      const res = await fetch(`${apiUrl}/public/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus('sent');
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.status === 400 && data?.error?.details?.length) {
        setFieldErrors(Object.fromEntries(data.error.details.map((d) => [d.path, d.message])));
        setStatus('idle');
        return;
      }
      setError(
        res.status === 429
          ? 'You’ve sent several messages recently. Please try again in an hour.'
          : data?.error?.message || 'Something went wrong. Please try again.',
      );
      setStatus('error');
    } catch {
      setError('We couldn’t send that. Check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <section aria-labelledby={`${id}-title`} className="rounded-3xl bg-surface p-6 sm:p-10" role="status">
        <p className="flex size-11 items-center justify-center rounded-full bg-accent text-on-accent">
          <Icon name="check" className="size-5" />
        </p>
        <h2 id={`${id}-title`} className="mt-5 font-display text-2xl font-extrabold tracking-tight">
          Thank you. Your message is in.
        </h2>
        <p className="mt-2 font-serif text-lg text-muted">We read every message and will reply to the email you left if we need more detail.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-3xl bg-surface p-6 sm:p-10">
      <h2 id={`${id}-title`} className="sr-only">
        Send a message
      </h2>
      <form onSubmit={onSubmit} noValidate className="grid gap-6">
        <fieldset>
          <legend className="label mb-2">What is it about?</legend>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <label
                key={t.value}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-paper px-4 font-display text-[0.95rem] has-[:checked]:bg-ink has-[:checked]:text-paper"
              >
                <input
                  type="radio"
                  name="topic"
                  value={t.value}
                  checked={topic === t.value}
                  onChange={() => setTopic(t.value)}
                  className="sr-only"
                />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className="label mb-1.5 block">
              Name <span className="normal-case">(optional)</span>
            </label>
            <input id={`${id}-name`} name="name" autoComplete="name" maxLength={100} className={inputCls} />
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="label mb-1.5 block">
              Email <span className="normal-case">(so we can reply)</span>
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              aria-invalid={fieldErrors.email ? 'true' : undefined}
              aria-describedby={fieldErrors.email ? `${id}-email-err` : undefined}
              className={inputCls}
            />
            {fieldErrors.email && (
              <p id={`${id}-email-err`} className="mt-1.5 text-sm font-semibold text-ink">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-message`} className="label mb-1.5 block">
            {topic === 'suggestion' ? 'Which startup, and where can we read about it?' : 'Your message'}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={6}
            required
            maxLength={5000}
            aria-invalid={fieldErrors.message ? 'true' : undefined}
            aria-describedby={fieldErrors.message ? `${id}-message-err` : undefined}
            className={`${inputCls} resize-y leading-relaxed`}
          />
          {fieldErrors.message && (
            <p id={`${id}-message-err`} className="mt-1.5 text-sm font-semibold text-ink">
              {fieldErrors.message}
            </p>
          )}
        </div>

        {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {status === 'error' && (
          <p role="alert" className="rounded-xl bg-paper px-4 py-3 font-display text-[0.95rem]">
            {error}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-display font-semibold text-paper transition-colors hover:bg-accent hover:text-on-accent disabled:cursor-wait disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </div>
      </form>
    </section>
  );
}

'use client';

import { useId, useState } from 'react';
import { Icon } from '../Icons';

const inputCls =
  'w-full rounded-xl bg-paper px-4 py-3 font-display text-base text-ink placeholder:text-muted aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-offset-0 aria-[invalid=true]:outline-[var(--ink)]';

/** "Spotted an error?" form. Posts straight to the public API (rate limited there, 3 per hour). */
export function CorrectionForm({ apiUrl, slug, name }) {
  const id = useId();
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = {
      caseStudySlug: slug,
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      message: String(form.get('message') ?? '').trim(),
      website: String(form.get('website') ?? ''), // honeypot
    };

    const errs = {};
    if (body.message.length < 10) errs.message = 'Please describe the correction in at least 10 characters.';
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errs.email = 'That email address doesn’t look right.';
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('sending');
    setError('');
    try {
      const res = await fetch(`${apiUrl}/public/corrections`, {
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
          ? 'You’ve sent several corrections recently. Please try again in an hour.'
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
          Thank you. It’s with the editor.
        </h2>
        <p className="mt-2 font-serif text-lg text-muted">
          Every correction is checked against sources before {name} is updated. If you left an email, we may get in touch.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-3xl bg-surface p-6 sm:p-10">
      <p className="label">Corrections</p>
      <h2 id={`${id}-title`} className="mt-3 font-display text-[1.75rem] leading-tight font-extrabold tracking-tight">
        Spotted an error?
      </h2>
      <p className="mt-2 font-serif text-lg leading-relaxed text-muted">
        If you know something about {name} that’s wrong or missing, tell us. A source helps us verify it faster.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className="label mb-1.5 block">
              Name <span className="normal-case">(optional)</span>
            </label>
            <input id={`${id}-name`} name="name" autoComplete="name" maxLength={100} className={inputCls} />
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="label mb-1.5 block">
              Email <span className="normal-case">(optional)</span>
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
            What should be corrected?
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={5}
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
            {status === 'sending' ? 'Sending…' : 'Send correction'}
          </button>
        </div>
      </form>
    </section>
  );
}

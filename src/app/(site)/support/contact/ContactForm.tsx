'use client';

import { useActionState } from 'react';
import { CheckCircle } from 'lucide-react';
import { submitSupportRequest, type ContactState } from './actions';
import { TOPICS } from './topics';

const field = 'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export function ContactForm({ defaultTopic = 'other', defaultMessage = '' }: { defaultTopic?: string; defaultMessage?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitSupportRequest, {});

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle className="mx-auto text-emerald-600" size={40} />
        <h2 className="mt-4 text-xl font-bold text-slate-900">მიმართვა მიღებულია</h2>
        <p className="mt-2 text-slate-600">გიპასუხებთ თქვენ მიერ მითითებულ საკონტაქტო მონაცემზე.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* honeypot: ადამიანს არ ეჩვენება; ბოტი ავსებს და ჩუმად იგნორირდება */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          სახელი
          <input name="name" required maxLength={80} autoComplete="name" className={field} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          ელფოსტა ან ტელეფონი
          <input name="contact" required maxLength={120} autoComplete="email" placeholder="name@example.com ან 5XX XXX XXX" className={field} />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        თემა
        <select name="topic" defaultValue={defaultTopic} className={field}>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-slate-700">
        შეტყობინება
        <textarea name="message" defaultValue={defaultMessage} required minLength={10} maxLength={2000} rows={6} placeholder="აღწერეთ საკითხი რაც შეიძლება დეტალურად" className={field} />
      </label>

      <p className="text-xs text-slate-500">
        არ მიუთითოთ პაროლი, საბანკო ბარათის მონაცემები ან ერთჯერადი კოდები — ჩვენ მათ არასდროს გთხოვთ.
      </p>

      {state.error && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'იგზავნება…' : 'გაგზავნა'}
      </button>
    </form>
  );
}

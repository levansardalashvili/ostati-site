'use client';

import { useState, useTransition } from 'react';
import { confirmEnroll, startEnroll, type EnrollStart } from '../actions';

export function EnrollForm() {
  const [start, setStart] = useState<EnrollStart | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const begin = () =>
    startTransition(async () => {
      setError(null);
      const res = await startEnroll();
      if (res.error) setError(res.error);
      else setStart(res);
    });

  const confirm = () =>
    startTransition(async () => {
      setError(null);
      const res = await confirmEnroll(start!.factorId!, code);
      if (res?.error) setError(res.error); // წარმატებაზე action თავად გადაამისამართებს
    });

  if (!start?.factorId) {
    return (
      <div className="mt-6">
        <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
          <li>დააინსტალირეთ Authenticator აპი ტელეფონზე (Google Authenticator, Authy ან 1Password).</li>
          <li>დააჭირეთ ღილაკს და დაასკანირეთ QR კოდი.</li>
          <li>შეიყვანეთ აპში გამოჩენილი 6-ციფრიანი კოდი.</li>
        </ol>
        {error && <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <button
          onClick={begin}
          disabled={pending}
          className="mt-5 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? 'მზადდება…' : 'დაწყება'}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-center rounded-xl border border-slate-200 bg-white p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={start.qr} alt="QR კოდი Authenticator აპისთვის" width={200} height={200} />
      </div>
      <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <p className="font-medium text-slate-700">QR არ სკანირდება? შეიყვანეთ ხელით:</p>
        <p className="mt-1 break-all font-mono text-sm text-slate-900">{start.secret}</p>
        <p className="mt-2">
          შეინახეთ ეს გასაღები პაროლების მენეჯერში — ტელეფონის დაკარგვისას მისით ახალ მოწყობილობაზე აღადგენთ დაცვას. სხვას არავის აჩვენოთ.
        </p>
      </div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={7}
        placeholder="000000"
        aria-label="6-ციფრიანი კოდი"
        className="w-full rounded-lg border border-slate-300 px-3 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <button
        onClick={confirm}
        disabled={pending || code.replace(/\s/g, '').length !== 6}
        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'მოწმდება…' : 'ჩართვა'}
      </button>
    </div>
  );
}

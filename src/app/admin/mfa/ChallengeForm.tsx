'use client';

import { useActionState } from 'react';
import { verifyLogin } from './actions';

export function ChallengeForm() {
  const [state, action, pending] = useActionState(verifyLogin, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <input
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        maxLength={7}
        placeholder="000000"
        aria-label="6-ციფრიანი კოდი"
        className="w-full rounded-lg border border-slate-300 px-3 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {state.error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'მოწმდება…' : 'დადასტურება'}
      </button>
    </form>
  );
}

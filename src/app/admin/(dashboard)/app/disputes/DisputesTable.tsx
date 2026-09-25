'use client';

import { ask } from '@/lib/dialog';
import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { resolveDispute } from './actions';

export type DisputedJobRow = {
  id: string;
  categoryName: string;
  customerName: string;
  providerName: string;
  disputeReason: string | null;
  updatedAt: string;
};

export function DisputesTable({ jobs }: { jobs: DisputedJobRow[] }) {
  if (jobs.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
        გადასაწყვეტი დავა არ არის
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {jobs.map((j) => (
        <DisputeCard key={j.id} job={j} />
      ))}
    </div>
  );
}

function DisputeCard({ job }: { job: DisputedJobRow }) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<'reopen' | 'cancel' | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 opacity-60 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          {job.categoryName} ({job.customerName} / {job.providerName}) —{' '}
          {done === 'reopen' ? 'ხელახლა დადასტურებისთვის გაიგზავნა' : 'გაუქმდა'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{job.categoryName}</h2>
      <p className="mt-1 text-sm text-slate-600">
        მომხმარებელი: <span className="font-medium">{job.customerName}</span> · ოსტატი:{' '}
        <span className="font-medium">{job.providerName}</span>
      </p>
      {job.disputeReason && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{job.disputeReason}</p>
      )}
      <p className="mt-2 text-xs text-slate-400">
        {formatDateTime(job.updatedAt)} · job: {job.id}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const res = await resolveDispute(job.id, 'reopen');
              if (res.error) setError(res.error);
              else setDone('reopen');
            });
          }}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          ოსტატს ვემხრობი — ხელახლა დადასტურებისთვის
        </button>
        <button
          disabled={pending}
          onClick={async () => {
            if (!(await ask('დარწმუნებული ხარ? სამუშაო გაუქმდება — მომხმარებელს ემხრობი.'))) return;
            setError(null);
            startTransition(async () => {
              const res = await resolveDispute(job.id, 'cancel');
              if (res.error) setError(res.error);
              else setDone('cancel');
            });
          }}
          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          მომხმარებელს ვემხრობი — გაუქმება
        </button>
        {error && <p className="self-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

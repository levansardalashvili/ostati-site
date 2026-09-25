'use client';

import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { cancelJob } from './actions';

export type JobRow = {
  id: string;
  category: string;
  status: string;
  statusLabel: string;
  description: string;
  address: string;
  district: string | null;
  customer: string;
  provider: string;
  createdAt: string;
  cancelledByAdmin: boolean;
};

const CANCELLABLE = ['pending', 'active', 'awaiting_customer_confirmation', 'disputed'];

export function JobsTable({ jobs, limit }: { jobs: JobRow[]; limit: number }) {
  if (jobs.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
        განცხადება ვერ მოიძებნა
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-3">
      {jobs.map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
      {jobs.length === limit && <p className="text-xs text-slate-400">ნაჩვენებია უახლესი {limit} — დააზუსტეთ ძებნა.</p>}
    </div>
  );
}

function JobCard({ job }: { job: JobRow }) {
  const [status, setStatus] = useState(job.status);
  const [label, setLabel] = useState(job.statusLabel);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const cancel = () => {
    const reason = window.prompt('გაუქმების მიზეზი (ეცნობება მონაწილეებს, არასავალდებულო):');
    if (reason === null) return;
    setError(null);
    startTransition(async () => {
      const res = await cancelJob(job.id, reason.trim() || undefined);
      if (res.error) {
        setError(res.error);
      } else {
        setStatus('cancelled');
        setLabel('გაუქმებული');
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">
            {job.category}
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{label}</span>
          </p>
          <p className="mt-1 text-sm text-slate-600">{job.description}</p>
          <p className="mt-2 text-xs text-slate-400">
            {job.district ? `${job.district} · ` : ''}
            {job.address}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            მომხმარებელი: <span className="font-medium">{job.customer}</span> · ოსტატი:{' '}
            <span className="font-medium">{job.provider}</span> · {formatDateTime(job.createdAt)}
          </p>
        </div>
        {CANCELLABLE.includes(status) && (
          <button
            type="button"
            disabled={pending}
            onClick={cancel}
            className="shrink-0 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            გაუქმება
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

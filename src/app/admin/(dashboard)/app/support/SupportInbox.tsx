'use client';

import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { setSupportRequest } from './actions';

export type SupportRow = {
  id: string;
  name: string;
  contact: string;
  topic: string;
  message: string;
  status: string;
  admin_note: string;
  created_at: string;
};

const TOPIC: Record<string, string> = {
  account: 'ანგარიში და შესვლა',
  job: 'განცხადება ან სამუშაო',
  verification: 'ვერიფიკაცია',
  payment: 'ფასი და ანგარიშსწორება',
  safety: 'უსაფრთხოება / წესების დარღვევა',
  technical: 'ტექნიკური პრობლემა',
  other: 'სხვა',
};
const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: 'ახალი', cls: 'bg-amber-100 text-amber-800' },
  in_progress: { label: 'მუშავდება', cls: 'bg-blue-100 text-blue-800' },
  closed: { label: 'დახურული', cls: 'bg-slate-200 text-slate-600' },
};

export function SupportInbox({ rows }: { rows: SupportRow[] }) {
  if (rows.length === 0) {
    return <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">მიმართვა არ არის</div>;
  }
  return (
    <div className="mt-6 space-y-3">
      {rows.map((r) => (
        <RequestCard key={r.id} row={r} />
      ))}
    </div>
  );
}

function RequestCard({ row }: { row: SupportRow }) {
  const [status, setStatus] = useState(row.status);
  const [note, setNote] = useState(row.admin_note);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const isEmail = row.contact.includes('@');

  const save = (next: string) => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const res = await setSupportRequest(row.id, next, note);
      if (res.error) setError(res.error);
      else {
        setStatus(next);
        setSaved(true);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS[status]?.cls ?? ''}`}>{STATUS[status]?.label ?? status}</span>
        <span className="text-sm font-semibold text-slate-900">{TOPIC[row.topic] ?? row.topic}</span>
        <span className="ml-auto text-xs text-slate-400">{formatDateTime(row.created_at)}</span>
      </div>
      <p className="mt-3 text-sm text-slate-700">
        <span className="font-medium">{row.name}</span> ·{' '}
        <a href={isEmail ? `mailto:${row.contact}` : `tel:${row.contact.replace(/\s/g, '')}`} className="text-blue-600 hover:underline">
          {row.contact}
        </a>
      </p>
      <p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-800">{row.message}</p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex-1 text-xs font-medium text-slate-500">
          შიდა შენიშვნა (მომხმარებელს არ ჩანს)
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800" />
        </label>
        <div className="flex flex-wrap gap-2">
          {status !== 'in_progress' && (
            <button disabled={pending} onClick={() => save('in_progress')} className="rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-50">
              მუშავდება
            </button>
          )}
          {status !== 'closed' && (
            <button disabled={pending} onClick={() => save('closed')} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50">
              დახურვა
            </button>
          )}
          {status !== 'new' && (
            <button disabled={pending} onClick={() => save('new')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              ახალად მონიშვნა
            </button>
          )}
          <button disabled={pending} onClick={() => save(status)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            შენიშვნის შენახვა
          </button>
        </div>
      </div>
      {saved && <p className="mt-2 text-sm text-emerald-600">შენახულია</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

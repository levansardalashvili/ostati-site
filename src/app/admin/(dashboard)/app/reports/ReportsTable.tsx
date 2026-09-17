'use client';

import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { updateReportStatus } from './actions';
import { REASON_LABEL, STATUS_LABEL, STATUSES } from './labels';

export type ReportRow = {
  id: string;
  jobId: string;
  reporterName: string;
  reportedName: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
};

const STATUS_COLOR: Record<string, string> = {
  open: 'bg-amber-100 text-amber-800',
  reviewing: 'bg-blue-100 text-blue-800',
  resolved: 'bg-emerald-100 text-emerald-800',
  dismissed: 'bg-slate-200 text-slate-600',
};

export function ReportsTable({ reports }: { reports: ReportRow[] }) {
  if (reports.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
        რეპორტი არ არის
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {reports.map((r) => (
        <ReportCard key={r.id} report={r} />
      ))}
    </div>
  );
}

function ReportCard({ report }: { report: ReportRow }) {
  const [status, setStatus] = useState(report.status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{REASON_LABEL[report.reason] ?? report.reason}</p>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-medium">{report.reporterName}</span> იჩივლა{' '}
            <span className="font-medium">{report.reportedName}</span>-ზე
          </p>
          {report.details && <p className="mt-2 text-sm text-slate-500">{report.details}</p>}
          <p className="mt-2 text-xs text-slate-400">
            {formatDateTime(report.createdAt)} · job: {report.jobId}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[status] ?? ''}`}>
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <select
          value={status}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            const prev = status;
            setStatus(next);
            setError(null);
            startTransition(async () => {
              const res = await updateReportStatus(report.id, next);
              if (res.error) {
                setError(res.error);
                setStatus(prev);
              }
            });
          }}
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}

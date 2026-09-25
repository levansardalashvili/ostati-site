'use client';

import { askText } from '@/lib/dialog';
import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { updateReportStatus, setUserSuspended, getReportConversation, type ConversationMessage } from './actions';
import { REASON_LABEL, STATUS_LABEL, STATUSES } from './labels';

export type ReportRow = {
  id: string;
  jobId: string | null; // chat_reports-ს job არ აქვს
  reporterId: string;
  reporterName: string;
  reportedUserId: string | null;
  reportedName: string;
  reportedSuspended: boolean;
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

export function ReportsTable({ reports, kind = 'job' }: { reports: ReportRow[]; kind?: 'job' | 'chat' }) {
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
        <ReportCard key={r.id} report={r} kind={kind} />
      ))}
    </div>
  );
}

function ReportCard({ report, kind }: { report: ReportRow; kind: 'job' | 'chat' }) {
  const [status, setStatus] = useState(report.status);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [suspended, setSuspended] = useState(report.reportedSuspended);
  const [suspendError, setSuspendError] = useState<string | null>(null);
  const [suspendPending, startSuspendTransition] = useTransition();
  const [convo, setConvo] = useState<ConversationMessage[] | null>(null);
  const [convoError, setConvoError] = useState<string | null>(null);
  const [convoPending, startConvoTransition] = useTransition();

  const toggleConvo = () => {
    if (convo) return setConvo(null);
    setConvoError(null);
    startConvoTransition(async () => {
      const res = await getReportConversation(report.id);
      if (res.error) setConvoError(res.error);
      else setConvo(res.messages ?? []);
    });
  };

  const toggleSuspend = async () => {
    if (!report.reportedUserId) return;
    const next = !suspended;
    const reason = next ? (await askText('შეჩერების მიზეზი (არასავალდებულო):')) ?? undefined : undefined;
    if (next && reason === undefined) return; // user cancelled the prompt
    setSuspendError(null);
    startSuspendTransition(async () => {
      const res = await setUserSuspended(report.reportedUserId!, next, reason);
      if (res.error) {
        setSuspendError(res.error);
      } else {
        setSuspended(next);
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{REASON_LABEL[report.reason] ?? report.reason}</p>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-medium">{report.reporterName}</span> იჩივლა{' '}
            <span className="font-medium">{report.reportedName}</span>-ზე
            {suspended && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">შეჩერებული</span>}
          </p>
          {report.details && <p className="mt-2 text-sm text-slate-500">{report.details}</p>}
          <p className="mt-2 text-xs text-slate-400">
            {formatDateTime(report.createdAt)}
            {report.jobId ? ` · job: ${report.jobId}` : ''}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[status] ?? ''}`}>
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <select
          value={status}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            const prev = status;
            setStatus(next);
            setError(null);
            startTransition(async () => {
              const res = await updateReportStatus(report.id, next, kind);
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

        {report.reportedUserId && (
          <button
            type="button"
            disabled={suspendPending}
            onClick={toggleSuspend}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${
              suspended
                ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                : 'border-red-300 text-red-700 hover:bg-red-50'
            }`}
          >
            {suspended ? 'ანგარიშის აღდგენა' : 'ანგარიშის შეჩერება'}
          </button>
        )}
        {suspendError && <span className="text-sm text-red-600">{suspendError}</span>}
        {kind === 'chat' && (
          <button
            type="button"
            disabled={convoPending}
            onClick={toggleConvo}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {convo ? 'საუბრის დამალვა' : 'საუბრის ნახვა'}
          </button>
        )}
        {convoError && <span className="text-sm text-red-600">{convoError}</span>}
      </div>

      {convo && (
        <div className="mt-3 max-h-72 space-y-1.5 overflow-y-auto rounded-xl bg-slate-50 p-3 text-sm">
          {convo.length === 0 && <p className="text-slate-400">შეტყობინებები არ მოიძებნა</p>}
          {convo.map((m) => (
            <p key={m.id} className={m.senderId === report.reporterId ? 'text-slate-700' : 'text-red-700'}>
              <span className="mr-2 text-xs font-semibold">{m.senderId === report.reporterId ? 'მომჩივანი' : 'დაბრალებული'}</span>
              {m.type === 'offer' ? `[ფასის შეთავაზება: ${m.amount} ₾]` : m.body || `[${m.type === "image" ? "ფოტო" : m.type}]`}
              <span className="ml-2 text-xs text-slate-400">{formatDateTime(m.createdAt)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

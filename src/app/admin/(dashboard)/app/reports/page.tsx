import { createClient } from '@/lib/supabase-admin/server';
import { ReportsTable, type ReportRow } from './ReportsTable';

type RawReport = {
  id: string;
  job_id?: string | null;
  reporter_id: string;
  reported_user_id: string | null;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
};

export default async function ReportsPage() {
  const supabase = await createClient();

  const [{ data: jobReports, error }, { data: chatReports, error: chatError }] = await Promise.all([
    supabase
      .from('job_reports')
      .select('id, job_id, reporter_id, reported_user_id, reason, details, status, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('chat_reports')
      .select('id, reporter_id, reported_user_id, reason, details, status, created_at')
      .order('created_at', { ascending: false }),
  ]);

  const all = [...((jobReports ?? []) as RawReport[]), ...((chatReports ?? []) as RawReport[])];
  const userIds = Array.from(
    new Set(all.flatMap((r) => [r.reporter_id, r.reported_user_id]).filter((v): v is string => !!v)),
  );

  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, first_name, last_name, email, suspended_at').in('id', userIds)
    : { data: [] };

  const nameById = Object.fromEntries(
    (users ?? []).map((u) => [u.id, `${u.first_name} ${u.last_name}`.trim() || u.email]),
  );
  const suspendedById = Object.fromEntries((users ?? []).map((u) => [u.id, !!u.suspended_at]));

  const toRows = (list: RawReport[]): ReportRow[] =>
    list.map((r) => ({
      id: r.id,
      jobId: r.job_id ?? null,
      reporterName: nameById[r.reporter_id] ?? r.reporter_id,
      reporterId: r.reporter_id,
      reportedUserId: r.reported_user_id,
      reportedName: r.reported_user_id ? (nameById[r.reported_user_id] ?? r.reported_user_id) : '—',
      reportedSuspended: r.reported_user_id ? (suspendedById[r.reported_user_id] ?? false) : false,
      reason: r.reason,
      details: r.details,
      status: r.status,
      createdAt: r.created_at,
    }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">რეპორტები</h1>
      <p className="mt-1 text-sm text-slate-500">Job-ებზე და ჩატებში შემოსული საჩივრები.</p>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">სამუშაოს რეპორტები</h2>
      {error ? (
        <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <ReportsTable reports={toRows((jobReports ?? []) as RawReport[])} kind="job" />
      )}

      <h2 className="mt-10 text-lg font-semibold text-slate-900">ჩატის რეპორტები</h2>
      {chatError ? (
        <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          ვერ ჩაიტვირთა: {chatError.message}
        </div>
      ) : (
        <ReportsTable reports={toRows((chatReports ?? []) as RawReport[])} kind="chat" />
      )}
    </div>
  );
}

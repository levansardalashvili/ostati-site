import { createClient } from '@/lib/supabase-admin/server';
import { ReportsTable, type ReportRow } from './ReportsTable';

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from('job_reports')
    .select('id, job_id, reporter_id, reported_user_id, reason, details, status, created_at')
    .order('created_at', { ascending: false });

  const userIds = Array.from(
    new Set((reports ?? []).flatMap((r) => [r.reporter_id, r.reported_user_id]).filter((v): v is string => !!v)),
  );

  const { data: users } = userIds.length
    ? await supabase.from('users').select('id, first_name, last_name, email').in('id', userIds)
    : { data: [] };

  const nameById = Object.fromEntries(
    (users ?? []).map((u) => [u.id, `${u.first_name} ${u.last_name}`.trim() || u.email]),
  );

  const rows: ReportRow[] = (reports ?? []).map((r) => ({
    id: r.id,
    jobId: r.job_id,
    reporterName: nameById[r.reporter_id] ?? r.reporter_id,
    reportedName: r.reported_user_id ? (nameById[r.reported_user_id] ?? r.reported_user_id) : '—',
    reason: r.reason,
    details: r.details,
    status: r.status,
    createdAt: r.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">რეპორტები</h1>
      <p className="mt-1 text-sm text-slate-500">Job-ებზე შემოსული საჩივრები (no-show, ქცევა და ა.შ.).</p>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          ვერ ჩაიტვირთა: {error.message}
        </div>
      ) : (
        <ReportsTable reports={rows} />
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase-admin/server';
import { DisputesTable, type DisputedJobRow } from './DisputesTable';

export default async function DisputesPage() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from('job_posts')
    .select('id, category, customer_id, provider_id, dispute_reason, dispute_provider_response, updated_at')
    .eq('status', 'disputed')
    .order('updated_at', { ascending: false });

  const userIds = Array.from(
    new Set((jobs ?? []).flatMap((j) => [j.customer_id, j.provider_id]).filter((v): v is string => !!v)),
  );
  const categoryIds = Array.from(new Set((jobs ?? []).map((j) => j.category).filter(Boolean)));

  const [{ data: users }, { data: categories }] = await Promise.all([
    userIds.length
      ? supabase.from('users').select('id, first_name, last_name, email').in('id', userIds)
      : Promise.resolve({ data: [] as { id: string; first_name: string; last_name: string; email: string }[] }),
    categoryIds.length
      ? supabase.from('categories').select('id, name').in('id', categoryIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
  ]);

  const nameById = Object.fromEntries(
    (users ?? []).map((u) => [u.id, `${u.first_name} ${u.last_name}`.trim() || u.email]),
  );
  const categoryNameById = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]));

  const rows: DisputedJobRow[] = (jobs ?? []).map((j) => ({
    id: j.id,
    categoryName: categoryNameById[j.category] ?? j.category,
    customerName: nameById[j.customer_id] ?? j.customer_id,
    providerName: j.provider_id ? (nameById[j.provider_id] ?? j.provider_id) : '—',
    disputeReason: j.dispute_reason,
    providerResponse: j.dispute_provider_response,
    updatedAt: j.updated_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">დავები</h1>
      <p className="mt-1 text-sm text-slate-500">
        სამუშაოები, რომელთა დასრულებასაც მომხმარებელმა დაუპირისპირდა — `disputed`-დან ამოსავალი გზა მხოლოდ აქედანაა.
      </p>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <DisputesTable jobs={rows} />
      )}
    </div>
  );
}

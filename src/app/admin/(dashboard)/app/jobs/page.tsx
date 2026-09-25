import { createClient } from '@/lib/supabase-admin/server';
import { JobsTable, type JobRow } from './JobsTable';

type Search = { status?: string; q?: string };

const LIMIT = 100;
const STATUS_LABEL: Record<string, string> = {
  draft: 'დრაფტი',
  pending: 'მომლოდინე',
  active: 'დადასტურებული',
  awaiting_customer_confirmation: 'ელოდება დადასტურებას',
  confirmed_awaiting_rating: 'ელოდება შეფასებას',
  completed: 'დასრულებული',
  disputed: 'დავა',
  cancelled: 'გაუქმებული',
};

export default async function JobsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { status = '', q = '' } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('job_posts')
    .select('id, category, status, description, address, district, customer_id, provider_id, created_at, cancellation_actor')
    .order('created_at', { ascending: false })
    .limit(LIMIT);
  if (status && status in STATUS_LABEL) query = query.eq('status', status);
  const term = q.replace(/[,()%*\\]/g, ' ').trim();
  if (term) query = query.or(`description.ilike.%${term}%,address.ilike.%${term}%`);

  const { data: jobs, error } = await query;

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
  const nameById = Object.fromEntries((users ?? []).map((u) => [u.id, `${u.first_name} ${u.last_name}`.trim() || u.email]));
  const categoryName = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]));

  const rows: JobRow[] = (jobs ?? []).map((j) => ({
    id: j.id,
    category: categoryName[j.category] ?? j.category,
    status: j.status,
    statusLabel: STATUS_LABEL[j.status] ?? j.status,
    description: j.description,
    address: j.address,
    district: j.district,
    customer: j.customer_id ? (nameById[j.customer_id] ?? j.customer_id) : '(წაშლილი)',
    provider: j.provider_id ? (nameById[j.provider_id] ?? j.provider_id) : '—',
    createdAt: j.created_at,
    cancelledByAdmin: j.cancellation_actor === 'admin',
  }));

  const input =
    'rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">განცხადებები</h1>
      <p className="mt-1 text-sm text-slate-500">ყველა განცხადება — ძებნა, ფილტრი და შეუსაბამოს გაუქმება (მონაწილეებს ეცნობებათ).</p>

      <form className="mt-6 flex flex-wrap gap-2" method="get">
        <input name="q" defaultValue={q} placeholder="აღწერა ან მისამართი" className={`${input} w-72`} />
        <select name="status" defaultValue={status} className={input}>
          <option value="">ყველა სტატუსი</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          ძებნა
        </button>
      </form>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <JobsTable jobs={rows} limit={LIMIT} />
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase-admin/server';
import { UsersTable, type UserRow } from './UsersTable';

type Search = { q?: string; role?: string; status?: string };

const LIMIT = 100;

export default async function UsersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q = '', role = '', status = '' } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('users')
    .select('id, role, first_name, last_name, email, phone, created_at, suspended_at, suspension_reason')
    .order('created_at', { ascending: false })
    .limit(LIMIT);

  // PostgREST-ის or() ფილტრის სინტაქსის სიმბოლოები ამოიღება (მძიმე/ფრჩხილი/პროცენტი)
  const term = q.replace(/[,()%*\\]/g, ' ').trim();
  if (term) {
    query = query.or(['first_name', 'last_name', 'email', 'phone'].map((c) => `${c}.ilike.%${term}%`).join(','));
  }
  if (role === 'customer' || role === 'provider' || role === 'admin') query = query.eq('role', role);
  if (status === 'suspended') query = query.not('suspended_at', 'is', null);
  if (status === 'active') query = query.is('suspended_at', null);

  const { data, error } = await query;

  const providerIds = (data ?? []).filter((u) => u.role === 'provider').map((u) => u.id);
  const { data: verifiedRows } = providerIds.length
    ? await supabase.from('provider_profiles').select('id').eq('verification_status', 'verified').in('id', providerIds)
    : { data: [] as { id: string }[] };
  const verifiedIds = new Set((verifiedRows ?? []).map((v) => v.id));

  const rows: UserRow[] = (data ?? []).map((u) => ({
    id: u.id,
    role: u.role,
    name: `${u.first_name} ${u.last_name}`.trim() || '(უსახელო)',
    email: u.email,
    phone: u.phone,
    createdAt: u.created_at,
    verified: verifiedIds.has(u.id),
    suspended: !!u.suspended_at,
    suspensionReason: u.suspension_reason,
  }));

  const input =
    'rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">მომხმარებლები</h1>
      <p className="mt-1 text-sm text-slate-500">ყველა ანგარიში — ძებნა, ფილტრი და შეჩერება/აღდგენა რეპორტის გარეშეც.</p>

      <form className="mt-6 flex flex-wrap gap-2" method="get">
        <input name="q" defaultValue={q} placeholder="სახელი, ელფოსტა ან ტელეფონი" className={`${input} w-72`} />
        <select name="role" defaultValue={role} className={input}>
          <option value="">ყველა როლი</option>
          <option value="customer">მომხმარებელი</option>
          <option value="provider">ოსტატი</option>
          <option value="admin">ადმინი</option>
        </select>
        <select name="status" defaultValue={status} className={input}>
          <option value="">ყველა სტატუსი</option>
          <option value="active">აქტიური</option>
          <option value="suspended">შეჩერებული</option>
        </select>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          ძებნა
        </button>
      </form>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <UsersTable users={rows} limit={LIMIT} />
      )}
    </div>
  );
}

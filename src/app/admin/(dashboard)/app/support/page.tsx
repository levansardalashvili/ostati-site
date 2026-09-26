import Link from 'next/link';
import { createClient } from '@/lib/supabase-admin/server';
import { SupportInbox, type SupportRow } from './SupportInbox';

const FILTERS = [
  { key: 'open', label: 'ღია (ახალი + მუშავდება)' },
  { key: 'new', label: 'ახალი' },
  { key: 'in_progress', label: 'მუშავდება' },
  { key: 'closed', label: 'დახურული' },
  { key: 'all', label: 'ყველა' },
];

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = 'open' } = await searchParams;
  const supabase = await createClient();
  let q = supabase
    .from('support_requests')
    .select('id, name, contact, topic, message, status, admin_note, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (status === 'open') q = q.in('status', ['new', 'in_progress']);
  else if (status !== 'all') q = q.eq('status', status);
  const { data, error } = await q;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">მიმართვები</h1>
      <p className="mt-1 text-sm text-slate-500">
        საიტის დახმარების ცენტრიდან გამოგზავნილი შეტყობინებები. პასუხი იგზავნება ხელით, მომხმარებლის მიერ მითითებულ ელფოსტაზე/ტელეფონზე.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/app/support?status=${f.key}`}
            className={`rounded-full border px-3 py-1 text-sm ${status === f.key ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            {f.label}
          </Link>
        ))}
      </div>
      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <SupportInbox rows={(data ?? []) as SupportRow[]} />
      )}
    </div>
  );
}

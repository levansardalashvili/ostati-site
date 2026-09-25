import Link from 'next/link';
import { createClient } from '@/lib/supabase-admin/server';

const CARDS = [
  { href: '/admin/app/users', label: 'მომხმარებლები', desc: 'ანგარიშების ძებნა, შეჩერება და აღდგენა' },
  { href: '/admin/app/jobs', label: 'განცხადებები', desc: 'განცხადებების ძებნა და შეუსაბამოს გაუქმება' },
  { href: '/admin/app/categories', label: 'კატეგორიები', desc: 'სერვისის კატეგორიების დამატება/რედაქტირება' },
  { href: '/admin/app/regions', label: 'რეგიონები', desc: 'რაიონების/ქალაქების სია ოსტატის არეალისა და განცხადებისთვის' },
  { href: '/admin/app/verification', label: 'ვერიფიკაციები', desc: 'ოსტატების ვერიფიკაციის მოთხოვნების განხილვა' },
  { href: '/admin/app/reports', label: 'რეპორტები', desc: 'სამუშაოსა და ჩატის საჩივრების მოდერაცია' },
  { href: '/admin/app/reviews', label: 'შეფასებები', desc: 'შეფასებების მოდერაცია (დამალვა)' },
  { href: '/admin/app/disputes', label: 'დავები', desc: 'შეჩერებული, დასაშლელი დავის მქონე სამუშაოები' },
  { href: '/admin/app/broadcasts', label: 'შეტყობინების გაგზავნა', desc: 'განცხადება ყველა მომხმარებლისთვის ან ერთი როლისთვის' },
  { href: '/admin/app/limits', label: 'ლიმიტები', desc: 'განცხადებების ლიმიტი, ვადები და ავტომატური წესები' },
];

export default async function AppManagementPage() {
  const supabase = await createClient();
  const head = (table: string) => supabase.from(table).select('id', { count: 'exact', head: true });

  const [customers, providers, verified, suspended, jobsOpen, jobsActive, jobsDone] = await Promise.all([
    head('users').eq('role', 'customer'),
    head('users').eq('role', 'provider'),
    head('provider_profiles').eq('verification_status', 'verified'),
    head('users').not('suspended_at', 'is', null),
    head('job_posts').eq('status', 'pending'),
    head('job_posts').in('status', ['active', 'awaiting_customer_confirmation', 'confirmed_awaiting_rating', 'disputed']),
    head('job_posts').eq('status', 'completed'),
  ]);

  const STATS = [
    { label: 'მომხმარებლები', value: customers.count ?? 0 },
    { label: 'ოსტატები', value: providers.count ?? 0 },
    { label: 'ვერიფიცირებული', value: verified.count ?? 0 },
    { label: 'შეჩერებული', value: suspended.count ?? 0 },
    { label: 'ღია განცხადებები', value: jobsOpen.count ?? 0 },
    { label: 'მიმდინარე სამუშაო', value: jobsActive.count ?? 0 },
    { label: 'დასრულებული', value: jobsDone.count ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">აპის მართვა</h1>
      <p className="mt-1 text-sm text-slate-500">Ostati მობილური აპლიკაციის მონაცემები.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow"
          >
            <h2 className="font-semibold text-slate-900">{c.label}</h2>
            <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

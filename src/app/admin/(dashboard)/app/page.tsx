import Link from 'next/link';

const CARDS = [
  { href: '/admin/app/categories', label: 'კატეგორიები', desc: 'სერვისის კატეგორიების დამატება/რედაქტირება' },
  { href: '/admin/app/verification', label: 'ვერიფიკაციები', desc: 'ოსტატების ვერიფიკაციის მოთხოვნების განხილვა' },
  { href: '/admin/app/reports', label: 'რეპორტები', desc: 'Job-ებზე შემოსული საჩივრების მოდერაცია' },
  { href: '/admin/app/reviews', label: 'შეფასებები', desc: 'შეფასებების მოდერაცია (დამალვა)' },
  { href: '/admin/app/disputes', label: 'დავები', desc: 'შეჩერებული, დასაშლელი დავის მქონე სამუშაოები' },
];

export default function AppManagementPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">აპის მართვა</h1>
      <p className="mt-1 text-sm text-slate-500">Ostati მობილური აპლიკაციის მონაცემები.</p>

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

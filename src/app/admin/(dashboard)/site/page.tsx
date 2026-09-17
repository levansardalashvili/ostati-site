import Link from 'next/link';

const CARDS = [
  { href: '/admin/site/content', label: 'საიტის კონტენტი', desc: 'ostati.ge-ის გვერდები და პარამეტრები' },
  {
    href: '/admin/app/categories',
    label: 'სერვისები / კატეგორიები',
    desc: 'ostati.ge/services იმავე კატეგორიებს აჩვენებს, რასაც აპი — რედაქტირდება "აპის მართვა"-დან',
  },
  {
    href: '/admin/site/blocks',
    label: 'გვერდის სექციები',
    desc: 'Feature-ბარათები და "როგორ მუშაობს"-ის ნაბიჯები',
  },
];

export default function SiteManagementPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">საიტის მართვა</h1>
      <p className="mt-1 text-sm text-slate-500">ostati.ge საინფორმაციო საიტის მართვა.</p>

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

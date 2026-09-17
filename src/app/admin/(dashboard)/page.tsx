import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">მთავარი</h1>
      <p className="mt-1 text-sm text-slate-500">Ostati-ის ადმინისტრირების პანელი.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/app"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow"
        >
          <h2 className="text-lg font-semibold text-slate-900">აპის მართვა</h2>
          <p className="mt-1 text-sm text-slate-500">
            კატეგორიები, ვერიფიკაციები, რეპორტები — Ostati მობილური აპლიკაციის მონაცემები
          </p>
        </Link>
        <Link
          href="/admin/site"
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow"
        >
          <h2 className="text-lg font-semibold text-slate-900">საიტის მართვა</h2>
          <p className="mt-1 text-sm text-slate-500">ostati.ge საინფორმაციო საიტის კონტენტი და პარამეტრები</p>
        </Link>
      </div>
    </div>
  );
}

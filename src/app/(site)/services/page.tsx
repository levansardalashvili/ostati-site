import type { Metadata } from 'next';
import { getCategories } from '@/lib/supabase';
import { getCategoryIcon } from '@/lib/categoryIcons';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'სერვისები',
  openGraph: { title: 'სერვისები', type: 'website' },
};

export default async function ServicesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">სერვისები</h1>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            Ostati-ზე იპოვი ოსტატს ნებისმიერი სახლის სამუშაოსთვის — {categories.length} კატეგორია.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((c) => {
            const Icon = getCategoryIcon(c.icon_key);
            return (
              <div
                key={c.id}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:border-blue-300 hover:shadow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={22} />
                </span>
                <span className="text-sm font-medium text-slate-900">{c.name}</span>
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <p className="text-center text-slate-400">კატეგორია ვერ მოიძებნა.</p>
        )}
      </div>
    </div>
  );
}

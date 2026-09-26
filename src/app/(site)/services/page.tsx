import type { Metadata } from 'next';
import { getCategories, getSettings } from '@/lib/supabase';
import { text } from '@/lib/siteTexts';
import { getCategoryIcon } from '@/lib/categoryIcons';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const title = text(await getSettings(), 'services_title');
  return { title };
}

export default async function ServicesPage() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);

  return (
    <div>
      <div className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{text(settings, 'services_title')}</h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-600">
            {text(settings, 'services_intro').replaceAll('{{categories}}', String(categories.length))}
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
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
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

import Link from 'next/link';
import { createClient } from '@/lib/supabase-admin/server';
import { CategoriesEditor, type CategoryRow } from './CategoriesEditor';

export default async function HelpAdminPage() {
  const supabase = await createClient();
  const [{ data: cats, error: catErr }, { data: arts, error: artErr }] = await Promise.all([
    supabase.from('help_categories').select('id, title, description, icon_key, is_published').order('sort_order', { ascending: true }),
    supabase.from('help_articles').select('id, category_id, title, is_published, sort_order, updated_at').order('sort_order', { ascending: true }),
  ]);

  const articles = arts ?? [];
  const categories: CategoryRow[] = (cats ?? []).map((c) => ({ ...c, articles: articles.filter((a) => a.category_id === c.id).length }));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">დახმარების ცენტრი</h1>
          <p className="mt-1 text-sm text-slate-500">კატეგორიები და სტატიები, რომლებიც საიტზე /support-ზე ჩანს. მიმართვებს იხილავთ „აპის მართვა → მიმართვები“-ში.</p>
        </div>
        <Link href="/admin/site/help/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
          + ახალი სტატია
        </Link>
      </div>

      {(catErr || artErr) && <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {(catErr ?? artErr)?.message}</div>}

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-400">კატეგორიები</h2>
      <CategoriesEditor categories={categories} />

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-400">სტატიები</h2>
      {categories.map((c) => {
        const list = articles.filter((a) => a.category_id === c.id);
        return (
          <section key={c.id} className="mt-4">
            <h3 className="text-sm font-semibold text-slate-900">{c.title}</h3>
            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
              {list.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400">სტატია არ არის</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {list.map((a) => (
                    <li key={a.id}>
                      <Link href={`/admin/site/help/${a.id}`} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-slate-50">
                        <span className="font-medium text-slate-800">{a.title}</span>
                        <span className={`text-xs ${a.is_published ? 'text-emerald-600' : 'text-amber-600'}`}>{a.is_published ? 'გამოქვეყნებულია' : 'დრაფტი'}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getHelpArticles, getHelpCategories } from '@/lib/supabase';

export const revalidate = 60;

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const c = (await getHelpCategories()).find((x) => x.id === category);
  return c ? { title: `${c.title} — დახმარება`, description: c.description || undefined } : {};
}

export default async function HelpCategoryPage({ params }: Props) {
  const { category } = await params;
  const [categories, all] = await Promise.all([getHelpCategories(), getHelpArticles()]);
  const c = categories.find((x) => x.id === category);
  if (!c) notFound();
  const articles = all.filter((a) => a.category_id === c.id);

  return (
    <div>
      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
          <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/support" className="font-medium text-blue-600 hover:underline">
              დახმარება
            </Link>
            <ChevronRight size={14} />
            <span className="truncate">{c.title}</span>
          </nav>
          <h1 className="break-words text-[1.7rem] font-extrabold tracking-tight text-slate-900 sm:text-4xl">{c.title}</h1>
          {c.description && <p className="mt-3 text-lg text-slate-600">{c.description}</p>}
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
          {articles.map((a) => (
            <li key={a.id}>
              <Link href={`/support/${c.id}/${a.slug}`} className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50">
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900 group-hover:text-blue-700">{a.title}</span>
                  {a.summary && <span className="mt-0.5 block text-sm text-slate-500">{a.summary}</span>}
                </span>
                <ChevronRight size={18} className="shrink-0 text-slate-300 group-hover:text-blue-600" />
              </Link>
            </li>
          ))}
          {articles.length === 0 && <li className="px-5 py-6 text-slate-500">ამ კატეგორიაში სტატია ჯერ არ არის.</li>}
        </ul>
        <p className="mt-8 text-sm text-slate-500">
          ვერ იპოვეთ პასუხი?{' '}
          <Link href="/support/contact" className="font-semibold text-blue-600 hover:underline">
            მოგვწერეთ
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

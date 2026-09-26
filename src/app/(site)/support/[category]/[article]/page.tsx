import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { getHelpArticles, getHelpCategories } from '@/lib/supabase';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getHelpArticles()).map((a) => ({ category: a.category_id, article: a.slug }));
}

type Props = { params: Promise<{ category: string; article: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, article } = await params;
  const a = (await getHelpArticles()).find((x) => x.category_id === category && x.slug === article);
  return a ? { title: `${a.title} — დახმარება`, description: a.summary || undefined } : {};
}

export default async function HelpArticlePage({ params }: Props) {
  const { category, article } = await params;
  const [categories, all] = await Promise.all([getHelpCategories(), getHelpArticles()]);
  const c = categories.find((x) => x.id === category);
  const a = all.find((x) => x.category_id === category && x.slug === article);
  if (!c || !a) notFound();
  const related = all.filter((x) => x.category_id === c.id && x.id !== a.id).slice(0, 5);

  return (
    <div>
      <div className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
          <nav aria-label="breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link href="/support" className="font-medium text-blue-600 hover:underline">
              დახმარება
            </Link>
            <ChevronRight size={14} />
            <Link href={`/support/${c.id}`} className="font-medium text-blue-600 hover:underline">
              {c.title}
            </Link>
          </nav>
          <h1 className="break-words text-[1.7rem] font-extrabold tracking-tight text-slate-900 sm:text-4xl">{a.title}</h1>
          {a.summary && <p className="mt-3 text-lg text-slate-600">{a.summary}</p>}
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <MarkdownContent content={a.content} />

        {related.length > 0 && (
          <aside className="mt-14 border-t border-slate-200 pt-8">
            <h2 className="text-base font-semibold text-slate-900">სხვა სტატიები: {c.title}</h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/support/${c.id}/${r.slug}`} className="text-sm font-medium text-blue-600 hover:underline">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="mt-10 rounded-2xl bg-slate-50 p-6 text-center">
          <p className="font-semibold text-slate-900">ვერ იპოვეთ პასუხი?</p>
          <p className="mt-1 text-sm text-slate-500">
            მოგვწერეთ და გიპასუხებთ.{' '}
            <Link href="/support/contact" className="font-semibold text-blue-600 hover:underline">
              მიმართვის გაგზავნა
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

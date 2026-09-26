import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { getHelpArticles, getHelpCategories } from '@/lib/supabase';

export const metadata: Metadata = { title: 'ძებნა — დახმარება', robots: { index: false } };

// ძებნა — ერთადერთი დინამიური გვერდი დახმარების ცენტრში (?q=); დანარჩენი /support გვერდები წინასწარ გენერირდება და ქეშირდება
export default async function HelpSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = q.trim().toLowerCase().slice(0, 80);
  const [categories, articles] = await Promise.all([getHelpCategories(), getHelpArticles()]);
  const catTitle = Object.fromEntries(categories.map((c) => [c.id, c.title]));
  const results = query ? articles.filter((a) => `${a.title} ${a.summary} ${a.content}`.toLowerCase().includes(query)) : [];

  return (
    <div>
      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">ძებნა დახმარებაში</h1>
          <form action="/support/search" className="relative mx-auto mt-8 max-w-xl">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              maxLength={80}
              autoFocus
              placeholder="მოძებნეთ პასუხი, მაგ. „ვერიფიკაცია“"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-28 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">ძებნა</button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {query && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">
              შედეგები „{q.trim()}“-ზე: {results.length}
            </h2>
            {results.length === 0 ? (
              <p className="mt-4 text-slate-600">
                ვერაფერი მოიძებნა. სცადეთ სხვა სიტყვა ან{' '}
                <Link href="/support/contact" className="font-semibold text-blue-600 hover:underline">
                  მოგვწერეთ
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {results.map((a) => (
                  <li key={a.id}>
                    <Link href={`/support/${a.category_id}/${a.slug}`} className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/60">
                      <span className="text-xs font-medium text-blue-600">{catTitle[a.category_id]}</span>
                      <span className="mt-1 block font-semibold text-slate-900">{a.title}</span>
                      {a.summary && <span className="mt-1 block text-sm text-slate-500">{a.summary}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <p className="mt-10 text-sm text-slate-500">
          <Link href="/support" className="font-semibold text-blue-600 hover:underline">
            ← დახმარების ცენტრი
          </Link>
        </p>
      </div>
    </div>
  );
}

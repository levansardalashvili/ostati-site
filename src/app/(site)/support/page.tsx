import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { getBlockIcon } from '@/lib/blockIcons';
import { getHelpArticles, getHelpCategories } from '@/lib/supabase';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'დახმარება',
  description: 'Ostati-ის დახმარების ცენტრი: პასუხები ხშირ კითხვებზე მომხმარებლებისთვის და ოსტატებისთვის, და მიმართვის ფორმა.',
};

export default async function HelpCenterPage() {
  const [categories, articles] = await Promise.all([getHelpCategories(), getHelpArticles()]);

  return (
    <div>
      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">როგორ დაგეხმაროთ?</h1>
          <form action="/support/search" className="relative mx-auto mt-8 max-w-xl">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              maxLength={80}
              placeholder="მოძებნეთ პასუხი, მაგ. „ვერიფიკაცია“"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-28 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              ძებნა
            </button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const Icon = getBlockIcon(c.icon_key);
            const count = articles.filter((a) => a.category_id === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/support/${c.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={22} />
                </span>
                <h2 className="mt-5 text-lg font-semibold text-slate-900">{c.title}</h2>
                {c.description && <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.description}</p>}
                <p className="mt-4 text-xs font-medium text-slate-400">{count} სტატია</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-14 rounded-3xl bg-slate-900 px-6 py-10 text-center sm:px-12">
          <h2 className="text-xl font-bold text-white sm:text-2xl">ვერ იპოვეთ პასუხი?</h2>
          <p className="mx-auto mt-3 max-w-md text-slate-300">მოგვწერეთ — გიპასუხებთ იმ საკონტაქტო მონაცემზე, რომელსაც მიუთითებთ.</p>
          <Link
            href="/support/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            მიმართვის გაგზავნა <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}

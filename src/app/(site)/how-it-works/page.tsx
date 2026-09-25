import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlockIcon } from '@/lib/blockIcons';
import { MarkdownContent } from '@/components/MarkdownContent';
import { StoreBadge } from '@/components/SiteChrome';
import { getBlocks, getPage, getSettings } from '@/lib/supabase';
import { text } from '@/lib/siteTexts';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('how-it-works');
  const title = page?.title ?? 'როგორ მუშაობს';
  return { title, openGraph: { title, type: 'website' } };
}

export default async function HowItWorksPage() {
  const [page, settings, steps] = await Promise.all([
    getPage('how-it-works'),
    getSettings(),
    getBlocks('how_it_works_steps'),
  ]);
  if (!page) notFound();

  return (
    <div>
      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{page.title}</h1>
          {page.content && (
            <div className="mx-auto mt-5 max-w-xl text-slate-600">
              <MarkdownContent content={page.content} />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="space-y-6">
          {steps.map((s, i) => {
            const Icon = getBlockIcon(s.icon_key);
            return (
              <div key={s.id} className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">{s.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{text(settings, 'hiw_cta_title')}</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <StoreBadge href={settings.play_store_url} kind="play" />
          <StoreBadge href={settings.app_store_url} kind="apple" />
        </div>
      </section>
    </div>
  );
}

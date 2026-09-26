import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlockIcon } from '@/lib/blockIcons';
import { MarkdownContent } from '@/components/MarkdownContent';
import { StoreBadge } from '@/components/SiteChrome';
import { getBlocks, getPage, getSettings, type SiteBlockItem } from '@/lib/supabase';
import { text } from '@/lib/siteTexts';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('how-it-works');
  const title = page?.title ?? 'როგორ მუშაობს';
  return { title, openGraph: { title, type: 'website' } };
}

function Steps({ steps }: { steps: SiteBlockItem[] }) {
  return (
    <div className="space-y-4">
      {steps.map((s, i) => {
        const Icon = getBlockIcon(s.icon_key);
        return (
          <div key={s.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60 sm:gap-5 sm:p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white">{i + 1}</span>
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex">
              <Icon size={20} />
            </span>
            <div>
              <h3 className="font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ერთი აუდიტორიის ნაწილი: სათაური, ნაბიჯების ბარათები, ვრცელი ტექსტი (Markdown, ადმინიდან)
function Audience({ id, title, steps, content }: { id: string; title: string; steps: SiteBlockItem[]; content?: string }) {
  return (
    <section id={id} className="scroll-mt-24 py-14 first:pt-16">
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      <div className="mt-8">
        <Steps steps={steps} />
      </div>
      {content && (
        <div className="mt-10 rounded-2xl border border-slate-100 bg-slate-50/60 p-6 sm:p-8">
          <MarkdownContent content={content} />
        </div>
      )}
    </section>
  );
}

export default async function HowItWorksPage() {
  const [page, settings, customerSteps, providerSteps, customerPage, providerPage] = await Promise.all([
    getPage('how-it-works'),
    getSettings(),
    getBlocks('how_it_works_steps'),
    getBlocks('how_it_works_provider_steps'),
    getPage('hiw_customers'),
    getPage('hiw_providers'),
  ]);
  if (!page) notFound();

  const customerTitle = customerPage?.title ?? 'მომხმარებლისთვის';
  const providerTitle = providerPage?.title ?? 'ოსტატისთვის';

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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#customers" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              {customerTitle}
            </a>
            <a href="#providers" className="rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
              {providerTitle}
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl divide-y divide-slate-100 px-4 sm:px-6">
        <Audience id="customers" title={customerTitle} steps={customerSteps} content={customerPage?.content} />
        <Audience id="providers" title={providerTitle} steps={providerSteps} content={providerPage?.content} />
      </div>

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

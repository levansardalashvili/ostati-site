import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { getBlockIcon } from '@/lib/blockIcons';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { PhoneShowcase, ScreenshotImage } from '@/components/PhoneShowcase';
import { PhoneFrame } from '@/components/PhoneFrame';
import { StoreBadge } from '@/components/SiteChrome';
import { getBlocks, getCategories, getPage, getScreenshots, getSettings } from '@/lib/supabase';
import { text } from '@/lib/siteTexts';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home');
  const title = page?.title ?? 'Ostati';
  const description = page?.content?.slice(0, 160) || 'Ostati აკავშირებს მომხმარებლებს სანდო, ადგილობრივ ოსტატებთან.';
  return {
    // absolute — home-ის title უკვე თავად ბრენდის tagline-ია (მაგ. "Ostati
    // — იპოვე სანდო ოსტატი"), root layout-ის title template-ს (" %s |
    // Ostati") არ სჭირდება მასზე დამატება, თორემ "Ostati" ორჯერ გაჩნდება.
    title: { absolute: title },
    description,
    openGraph: { title, description, type: 'website' },
  };
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">{children}</p>;
}

export default async function HomePage() {
  const [page, settings, features, steps, cta, categories, providers, screenshots] = await Promise.all([
    getPage('home'),
    getSettings(),
    getBlocks('home_features'),
    getBlocks('how_it_works_steps'),
    getPage('home_cta'),
    getCategories(),
    getPage('home_providers'),
    getScreenshots(),
  ]);
  if (!page) notFound();

  // "Ostati — იპოვე სანდო ოსტატი" → ბრენდი პატარა ბეჯში, სათაური დიდად
  const [brand, headline] = page.title.includes('—')
    ? page.title.split('—').map((s) => s.trim())
    : ['', page.title];

  // ხარ ოსტატი? — პირველი აბზაცი (შესავალი) + სიის პუნქტები
  const providerLines = (providers?.content ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
  const providerIntro = providerLines.filter((l) => !l.startsWith('-'))[0];
  const providerPoints = providerLines.filter((l) => l.startsWith('-')).map((l) => l.replace(/^-\s*/, ''));

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-4 px-4 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pt-20">
          <div className="text-center lg:text-left">
            {brand && (
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> {brand}
              </span>
            )}
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              {headline}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">{page.content}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <StoreBadge href={settings.play_store_url} kind="play" />
              <StoreBadge href={settings.app_store_url} kind="apple" />
            </div>
            {text(settings, 'hero_note') && <p className="mt-4 text-sm text-slate-500">{text(settings, 'hero_note')}</p>}
          </div>

          <PhoneShowcase shots={screenshots} />
        </div>
      </section>

      {/* აპის დანარჩენი ეკრანები (პირველი ორი hero-შია) */}
      {screenshots.length > 2 && (
        <section className="border-y border-slate-100 bg-slate-50/60">
          <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-14 sm:justify-center sm:px-6">
            {screenshots.slice(2).map((s) => (
              <PhoneFrame key={s.id} className="!w-[220px] shrink-0 sm:!w-[240px]">
                <ScreenshotImage shot={s} />
              </PhoneFrame>
            ))}
          </div>
        </section>
      )}

      {/* კატეგორიები */}
      {categories.length > 0 && (
        <section className="border-y border-slate-100 bg-slate-50/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="text-center">
              <Eyebrow>{text(settings, 'home_services_eyebrow')}</Eyebrow>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{text(settings, 'home_services_title')}</h2>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {categories.map((c) => {
                const Icon = getCategoryIcon(c.icon_key);
                return (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    <Icon size={16} className="text-blue-600" />
                    {c.name}
                  </span>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
                {text(settings, 'home_services_link')} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* უპირატესობები */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{text(settings, 'home_features_eyebrow')}</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{text(settings, 'home_features_title')}</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = getBlockIcon(f.icon_key);
            return (
              <div
                key={f.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {f.title.replaceAll('{{categories}}', String(categories.length))}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* როგორ მუშაობს */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <Eyebrow>{text(settings, 'home_steps_eyebrow')}</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{text(settings, 'home_steps_title')}</h2>
          </div>
          <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-6 hidden border-t-2 border-dashed border-blue-200 sm:block" />
            {steps.map((s, i) => (
              <div key={s.id} className="relative text-center">
                <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/30 ring-8 ring-slate-50">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
              {text(settings, 'home_steps_link')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ოსტატებისთვის */}
      {providers && providerPoints.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-12 text-white shadow-xl shadow-blue-600/20 sm:px-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">{text(settings, 'home_providers_eyebrow')}</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{providers.title}</h2>
              {providerIntro && <p className="mt-4 text-blue-100">{providerIntro}</p>}
              <Link href="/how-it-works#providers" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline">
                ვრცლად: როგორ მუშაობს ოსტატისთვის <ArrowRight size={15} />
              </Link>
            </div>
            <ul className="mt-8 space-y-4 lg:mt-0">
              {providerPoints.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  <span className="text-blue-50">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* გადმოწერა */}
      <section id="download" className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{cta?.title ?? 'დაიწყე დღესვე'}</h2>
          {cta?.content && <p className="mx-auto mt-3 max-w-md text-slate-300">{cta.content}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <StoreBadge href={settings.play_store_url} kind="play" onDark />
            <StoreBadge href={settings.app_store_url} kind="apple" onDark />
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlockIcon } from '@/lib/blockIcons';
import { PhoneShowcase } from '@/components/PhoneShowcase';
import { StoreBadge } from '@/components/SiteChrome';
import { getBlocks, getPage, getSettings } from '@/lib/supabase';

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

export default async function HomePage() {
  const [page, settings, features, steps, cta] = await Promise.all([
    getPage('home'),
    getSettings(),
    getBlocks('home_features'),
    getBlocks('how_it_works_steps'),
    getPage('home_cta'),
  ]);
  if (!page) notFound();

  return (
    <div>
      <section className="overflow-hidden border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6 sm:pt-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{page.title}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">{page.content}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <StoreBadge href={settings.play_store_url} kind="play" />
            <StoreBadge href={settings.app_store_url} kind="apple" />
          </div>
        </div>

        <div className="mt-4">
          <PhoneShowcase />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = getBlockIcon(f.icon_key);
            return (
              <div key={f.id} className="rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">როგორ მუშაობს</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.id} className="text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/how-it-works" className="text-sm font-semibold text-blue-600 hover:underline">
              დეტალურად →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{cta?.title ?? 'დაიწყე დღესვე'}</h2>
        {cta?.content && <p className="mx-auto mt-3 max-w-md text-slate-600">{cta.content}</p>}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <StoreBadge href={settings.play_store_url} kind="play" />
          <StoreBadge href={settings.app_store_url} kind="apple" />
        </div>
      </section>
    </div>
  );
}

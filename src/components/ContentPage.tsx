import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/MarkdownContent';
import { getPage, getSettings } from '@/lib/supabase';

export async function ContentPage({ slug }: { slug: string }) {
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  if (!page) notFound();
  // {{contact_email}} — settings-იდან; თუ ჯერ არ არის მითითებული, ტექსტი მაინც გასაგები რჩება
  const email = settings.contact_email?.trim();
  const content = page.content.replaceAll('{{contact_email}}', email ? `[${email}](mailto:${email})` : '(საკონტაქტო ელფოსტა მალე დაემატება)');

  return (
    <div>
      <div className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="break-words text-[1.7rem] font-extrabold tracking-tight text-slate-900 sm:text-4xl">{page.title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <MarkdownContent content={content} />
      </div>
    </div>
  );
}

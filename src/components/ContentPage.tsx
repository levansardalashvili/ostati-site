import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/MarkdownContent';
import { LegalBreadcrumb, LegalRelated } from '@/components/LegalRelated';
import { getLegalPages, getPage, getSettings } from '@/lib/supabase';

export async function ContentPage({ slug }: { slug: string }) {
  const [page, settings, legalDocs] = await Promise.all([getPage(slug), getSettings(), getLegalPages()]);
  if (!page) notFound();
  // {{contact_email}} — settings-იდან; თუ ჯერ არ არის მითითებული, ტექსტი მაინც გასაგები რჩება
  const email = settings.contact_email?.trim();
  const content = page.content.replaceAll('{{contact_email}}', email ? `[${email}](mailto:${email})` : '(საკონტაქტო ელფოსტა მალე დაემატება)');

  const isLegal = legalDocs.some((d) => d.slug === slug);

  return (
    <div>
      <div className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          {isLegal && <LegalBreadcrumb title={page.title} />}
          <h1 className="break-words text-[1.7rem] font-extrabold tracking-tight text-slate-900 sm:text-4xl">{page.title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <MarkdownContent content={content} />
        {isLegal && <LegalRelated docs={legalDocs} currentSlug={slug} />}
      </div>
    </div>
  );
}

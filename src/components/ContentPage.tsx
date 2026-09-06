import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/MarkdownContent';
import { getPage } from '@/lib/supabase';

export async function ContentPage({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{page.title}</h1>
      <div className="mt-8">
        <MarkdownContent content={page.content} />
      </div>
    </div>
  );
}

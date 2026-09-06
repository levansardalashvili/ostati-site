import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/MarkdownContent';
import { getPage } from '@/lib/supabase';

export const revalidate = 60;

export default async function HomePage() {
  const page = await getPage('home');
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{page.title}</h1>
      <div className="mt-8">
        <MarkdownContent content={page.content} />
      </div>
    </div>
  );
}

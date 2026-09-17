import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarkdownContent } from '@/components/MarkdownContent';
import { getPage } from '@/lib/supabase';

// გაზიარებული helper — privacy/terms page.tsx-ის ორივე `generateMetadata`
// ერთსა და იმავე ლოგიკას იძახებდა (Next.js-ის automatic fetch-memoization
// მაინც დაახარჯვინებდა ერთ query-ს ორივესთვის — page.tsx-ის საკუთარ
// getPage(slug)-თან ერთად, ერთ request-ში).
export async function generateContentMetadata(slug: string): Promise<Metadata> {
  const page = await getPage(slug);
  const title = page?.title ?? slug;
  return { title, openGraph: { title, type: 'website' } };
}

export async function ContentPage({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{page.title}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <MarkdownContent content={page.content} />
      </div>
    </div>
  );
}

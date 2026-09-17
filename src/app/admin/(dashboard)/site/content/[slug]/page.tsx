import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-admin/server';
import { PageEditor } from './PageEditor';

export default async function EditSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase
    .from('site_pages')
    .select('slug, title, content')
    .eq('slug', slug)
    .single();

  if (!page) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/site/content" className="text-sm font-medium text-blue-600 hover:underline">
        ← საიტის კონტენტი
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">{page.title}</h1>
      <p className="mt-1 text-sm text-slate-500">გვერდი: {page.slug}</p>

      <div className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <PageEditor slug={page.slug} title={page.title} content={page.content} />
      </div>
    </div>
  );
}

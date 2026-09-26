import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-admin/server';
import { ArticleForm } from '../ArticleForm';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: article }, { data: cats }] = await Promise.all([
    supabase.from('help_articles').select('id, category_id, slug, title, summary, content, sort_order, is_published').eq('id', id).single(),
    supabase.from('help_categories').select('id, title').order('sort_order', { ascending: true }),
  ]);
  if (!article) notFound();

  return (
    <div>
      <Link href="/admin/site/help" className="text-sm font-medium text-blue-600 hover:underline">
        ← დახმარების ცენტრი
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">{article.title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        /support/{article.category_id}/{article.slug}
      </p>
      <div className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <ArticleForm key={article.id} categories={cats ?? []} initial={article} />
      </div>
    </div>
  );
}

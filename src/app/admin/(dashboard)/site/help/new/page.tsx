import Link from 'next/link';
import { createClient } from '@/lib/supabase-admin/server';
import { ArticleForm } from '../ArticleForm';

export default async function NewArticlePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const supabase = await createClient();
  const { data: cats } = await supabase.from('help_categories').select('id, title').order('sort_order', { ascending: true });

  return (
    <div>
      <Link href="/admin/site/help" className="text-sm font-medium text-blue-600 hover:underline">
        ← დახმარების ცენტრი
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">ახალი სტატია</h1>
      <div className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <ArticleForm
          categories={cats ?? []}
          initial={{ category_id: category ?? cats?.[0]?.id ?? '', slug: '', title: '', summary: '', content: '', sort_order: 99, is_published: true }}
        />
      </div>
    </div>
  );
}

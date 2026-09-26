import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-admin/server';
import { PageForm, type PageInitial } from '../PageForm';

const SYSTEM_NOTES: Record<string, string> = {
  home: 'მთავარი გვერდის სათაური და შესავალი ტექსტი (hero). სათაურში „—“ ბეჯს და დიდ სათაურს ყოფს.',
  home_cta: 'მთავარი გვერდის ბოლო „გადმოწერე“ ბლოკის სათაური და ტექსტი.',
  home_providers: '„ოსტატებისთვის“ ბლოკი მთავარზე: სათაური, პირველი აბზაცი და სია (- პუნქტები).',
  hiw_customers: '„როგორ მუშაობს“ გვერდის ნაწილი მომხმარებლისთვის: სათაური (სექციის სახელი) და ვრცელი ტექსტი (### ქვესათაურებით). ნაბიჯების ბარათები რედაქტირდება „გვერდის სექციებიდან“.',
  hiw_providers: '„როგორ მუშაობს“ გვერდის ნაწილი ოსტატისთვის: სათაური (სექციის სახელი) და ვრცელი ტექსტი (### ქვესათაურებით). ნაბიჯების ბარათები რედაქტირდება „გვერდის სექციებიდან“.',
  'how-it-works': '„როგორ მუშაობს“ გვერდის სათაური და შესავალი. ნაბიჯები რედაქტირდება „გვერდის სექციებიდან“.',
};

export default async function EditSitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase
    .from('site_pages')
    .select('slug, kind, title, content, meta_description, nav_label, is_published, show_in_header, show_in_footer, in_legal, sort_order')
    .eq('slug', slug)
    .single();
  if (!page) notFound();

  return (
    <div>
      <Link href="/admin/site/content" className="text-sm font-medium text-blue-600 hover:underline">
        ← საიტის კონტენტი
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">{page.title}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {page.kind === 'system' ? `სისტემური გვერდი: ${page.slug}` : `მისამართი: /${page.slug}`}
      </p>
      {page.kind === 'system' && SYSTEM_NOTES[page.slug] && (
        <p className="mt-3 max-w-3xl rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {SYSTEM_NOTES[page.slug]} სისტემური გვერდი არ იშლება.
        </p>
      )}

      <div className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <PageForm key={page.slug} mode="edit" initial={page as PageInitial} />
      </div>
    </div>
  );
}

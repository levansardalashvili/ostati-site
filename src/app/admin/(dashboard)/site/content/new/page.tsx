import Link from 'next/link';
import { PageForm } from '../PageForm';

export default function NewSitePage() {
  return (
    <div>
      <Link href="/admin/site/content" className="text-sm font-medium text-blue-600 hover:underline">
        ← საიტის კონტენტი
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">ახალი გვერდი</h1>
      <p className="mt-1 text-sm text-slate-500">გვერდი გამოქვეყნებისთანავე ხელმისაწვდომი იქნება საიტზე /მისამართი-ზე.</p>
      <div className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <PageForm
          mode="create"
          initial={{
            slug: '',
            kind: 'page',
            title: '',
            content: '',
            meta_description: '',
            nav_label: '',
            is_published: true,
            show_in_header: false,
            show_in_footer: true,
            in_legal: false,
            sort_order: 10,
          }}
        />
      </div>
    </div>
  );
}

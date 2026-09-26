'use client';

import { ask } from '@/lib/dialog';
import { useMemo, useState, useTransition } from 'react';
import { renderMarkdown } from '@/lib/markdown';
import { createPage, deletePage, updatePage } from './actions';

export type PageInitial = {
  slug: string;
  kind: 'system' | 'page';
  title: string;
  content: string;
  meta_description: string;
  nav_label: string;
  is_published: boolean;
  show_in_header: boolean;
  show_in_footer: boolean;
  in_legal: boolean;
  sort_order: number;
};

const input = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

export function PageForm({ mode, initial }: { mode: 'create' | 'edit'; initial: PageInitial }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(initial.content);
  const [preview, setPreview] = useState(false);
  const isSystem = initial.kind === 'system';

  const html = useMemo(() => (preview ? renderMarkdown(content) : ''), [preview, content]);

  const onDelete = async () => {
    if (!(await ask(`გვერდის „${initial.title}“ წაშლა? ეს შეუქცევადია და მისამართი (/${initial.slug}) საიტზე აღარ იმუშავებს.`))) return;
    startTransition(async () => {
      const res = await deletePage(initial.slug);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form
      action={(formData) => {
        setError(null);
        setSaved(false);
        startTransition(async () => {
          const res = mode === 'create' ? await createPage(formData) : await updatePage(initial.slug, formData);
          if (res?.error) setError(res.error);
          else setSaved(true);
        });
      }}
      className="space-y-5"
    >
      {mode === 'create' && (
        <div>
          <label className="block text-xs font-medium text-slate-500">მისამართი (URL)</label>
          <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <span>ostati.ge/</span>
            <input name="slug" required placeholder="about-us" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={`${input} !mt-0 max-w-xs`} />
          </div>
          <p className="mt-1 text-xs text-slate-400">პატარა ლათინური ასოები, ციფრები და დეფისი. შექმნის შემდეგ ვეღარ შეიცვლება.</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-500">სათაური</label>
        <input name="title" defaultValue={initial.title} required maxLength={120} className={input} />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-500">ტექსტი (Markdown — ცარიელი ხაზი = ახალი აბზაცი)</label>
          <button type="button" onClick={() => setPreview((p) => !p)} className="text-xs font-medium text-blue-600 hover:underline">
            {preview ? 'რედაქტირება' : 'გადახედვა'}
          </button>
        </div>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className={`${input} font-mono ${preview ? 'hidden' : ''}`}
        />
        {preview && (
          <div
            className="prose prose-slate mt-1 max-w-none rounded-lg border border-slate-200 bg-slate-50 p-4"
            // ადმინის მიერ დაწერილი ტექსტი (site_pages-ზე ჩაწერა მხოლოდ ადმინს შეუძლია)
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        <p className="mt-1 text-xs text-slate-400">
          სათაური: <code>## სათაური</code> · მსხვილი: <code>**ტექსტი**</code> · სია: <code>- პუნქტი</code> · ბმული:{' '}
          <code>[ტექსტი](/support)</code>. <code>{'{{contact_email}}'}</code> საიტზე საკონტაქტო ელფოსტით იცვლება.
        </p>
      </div>

      {!isSystem && (
        <>
          <div>
            <label className="block text-xs font-medium text-slate-500">მოკლე აღწერა (Google-ისთვის, არასავალდებულო)</label>
            <input name="meta_description" defaultValue={initial.meta_description} maxLength={200} className={input} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">განლაგება</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_published" defaultChecked={initial.is_published} /> გამოქვეყნებული (გამორთვისას საიტზე აღარ ჩანს)
              </label>
              <label className="flex flex-wrap items-center gap-2">
                მენიუს მოკლე სახელი:
                <input name="nav_label" defaultValue={initial.nav_label} maxLength={30} placeholder={initial.title} className="w-56 rounded-lg border border-slate-300 px-2 py-1 text-sm" />
                <span className="text-xs text-slate-400">(ცარიელი = სრული სათაური; გრძელი სათაური ჰედერში არ ეტევა)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="show_in_header" defaultChecked={initial.show_in_header} /> ჩანდეს ჰედერის მენიუში
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="show_in_footer" defaultChecked={initial.show_in_footer} /> ჩანდეს ფუტერში
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="in_legal" defaultChecked={initial.in_legal} /> სამართლებრივი ცენტრის დოკუმენტი (ჩანს /legal-ზე და „დაკავშირებულ დოკუმენტებში“)
              </label>
              <label className="flex items-center gap-2">
                რიგი მენიუში:
                <input type="number" name="sort_order" defaultValue={initial.sort_order} className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm" />
                <span className="text-xs text-slate-400">(მცირე რიცხვი — უფრო წინ)</span>
              </label>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {mode === 'create' ? 'გვერდის შექმნა' : 'შენახვა'}
        </button>
        {mode === 'edit' && !isSystem && (
          <>
            <a href={`/${initial.slug}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
              საიტზე ნახვა ↗
            </a>
            <button
              type="button"
              disabled={pending}
              onClick={onDelete}
              className="ml-auto rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              გვერდის წაშლა
            </button>
          </>
        )}
        {saved && <span className="text-sm font-medium text-emerald-600">შენახულია</span>}
        {error && <span className="text-sm font-medium text-red-600">{error}</span>}
      </div>
    </form>
  );
}

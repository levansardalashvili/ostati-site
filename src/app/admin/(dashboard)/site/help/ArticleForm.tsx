'use client';

import { useMemo, useState, useTransition } from 'react';
import { marked } from 'marked';
import { ask } from '@/lib/dialog';
import { createArticle, deleteArticle, updateArticle } from './actions';

export type ArticleInitial = {
  id?: string;
  category_id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  sort_order: number;
  is_published: boolean;
};

const input = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

export function ArticleForm({ initial, categories }: { initial: ArticleInitial; categories: { id: string; title: string }[] }) {
  const isEdit = !!initial.id;
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(initial.content);
  const [preview, setPreview] = useState(false);
  const html = useMemo(() => (preview ? (marked.parse(content, { async: false }) as string) : ''), [preview, content]);

  const onDelete = async () => {
    if (!(await ask(`სტატიის „${initial.title}“ წაშლა? ეს შეუქცევადია.`))) return;
    startTransition(async () => {
      const res = await deleteArticle(initial.id!);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <form
      action={(fd) => {
        setError(null);
        setSaved(false);
        startTransition(async () => {
          const res = isEdit ? await updateArticle(initial.id!, fd) : await createArticle(fd);
          if (res?.error) setError(res.error);
          else setSaved(true);
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-slate-500">
          კატეგორია
          <select name="category_id" defaultValue={initial.category_id} required className={input}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        {!isEdit && (
          <label className="block text-xs font-medium text-slate-500">
            მისამართი (URL ბოლო ნაწილი)
            <input name="slug" required maxLength={60} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="how-to-do-x" className={input} />
          </label>
        )}
      </div>

      <label className="block text-xs font-medium text-slate-500">
        სათაური
        <input name="title" defaultValue={initial.title} required maxLength={120} className={input} />
      </label>
      <label className="block text-xs font-medium text-slate-500">
        მოკლე აღწერა (ჩანს სიებში და ძებნაში)
        <input name="summary" defaultValue={initial.summary} maxLength={200} className={input} />
      </label>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-medium text-slate-500">ტექსტი (Markdown — ცარიელი ხაზი = ახალი აბზაცი)</label>
          <button type="button" onClick={() => setPreview((p) => !p)} className="text-xs font-medium text-blue-600 hover:underline">
            {preview ? 'რედაქტირება' : 'გადახედვა'}
          </button>
        </div>
        <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)} rows={18} className={`${input} font-mono ${preview ? 'hidden' : ''}`} />
        {preview && (
          <div
            className="prose prose-slate mt-1 max-w-none rounded-lg border border-slate-200 bg-slate-50 p-4"
            // ადმინის მიერ დაწერილი ტექსტი (help_articles-ზე ჩაწერა მხოლოდ ადმინს შეუძლია)
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        <p className="mt-1 text-xs text-slate-400">
          სია: <code>- პუნქტი</code> · დანომრილი: <code>1. პუნქტი</code> · მსხვილი: <code>**ტექსტი**</code> · ბმული სხვა სტატიაზე: <code>[ტექსტი](/support/კატეგორია/მისამართი)</code> · ქვესათაური: <code>### სათაური</code>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_published" defaultChecked={initial.is_published} /> გამოქვეყნებული
        </label>
        <label className="flex items-center gap-2">
          რიგი კატეგორიაში:
          <input type="number" name="sort_order" defaultValue={initial.sort_order} className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {isEdit ? 'შენახვა' : 'სტატიის შექმნა'}
        </button>
        {isEdit && (
          <>
            <a href={`/support/${initial.category_id}/${initial.slug}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
              საიტზე ნახვა ↗
            </a>
            <button type="button" disabled={pending} onClick={onDelete} className="ml-auto rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50">
              სტატიის წაშლა
            </button>
          </>
        )}
        {saved && <span className="text-sm font-medium text-emerald-600">შენახულია</span>}
        {error && <span className="text-sm font-medium text-red-600">{error}</span>}
      </div>
    </form>
  );
}

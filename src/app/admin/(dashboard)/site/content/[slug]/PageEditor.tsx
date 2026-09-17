'use client';

import { useState, useTransition } from 'react';
import { updatePage } from '../actions';

export function PageEditor({ slug, title, content }: { slug: string; title: string; content: string }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setError(null);
        setSaved(false);
        startTransition(async () => {
          const res = await updatePage(slug, formData);
          if (res.error) setError(res.error);
          else setSaved(true);
        });
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-medium text-slate-500">სათაური</label>
        <input
          name="title"
          defaultValue={title}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500">
          ტექსტი (Markdown — ცარიელი ხაზი = ახალი აბზაცი)
        </label>
        <textarea
          name="content"
          defaultValue={content}
          rows={16}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          შენახვა
        </button>
        {saved && <span className="text-sm text-emerald-600">შენახულია</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  );
}

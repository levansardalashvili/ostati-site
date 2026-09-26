'use client';

import { useState, useTransition } from 'react';
import { ask } from '@/lib/dialog';
import { ICON_KEYS } from '../blocks/icons';
import { createCategory, deleteCategory, moveCategory, updateCategory } from './actions';

export type CategoryRow = { id: string; title: string; description: string; icon_key: string; is_published: boolean; articles: number };

const input = 'rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500';

function CategoryFields({ row }: { row?: CategoryRow }) {
  return (
    <>
      <input name="title" defaultValue={row?.title} required maxLength={80} placeholder="სათაური" className={`${input} min-w-[12rem] flex-1`} />
      <input name="description" defaultValue={row?.description} maxLength={200} placeholder="მოკლე აღწერა" className={`${input} min-w-[14rem] flex-[2]`} />
      <select name="icon_key" defaultValue={row?.icon_key ?? 'FileText'} className={input}>
        {ICON_KEYS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-1.5 text-sm text-slate-600">
        <input type="checkbox" name="is_published" defaultChecked={row ? row.is_published : true} /> ჩანს
      </label>
    </>
  );
}

export function CategoriesEditor({ categories }: { categories: CategoryRow[] }) {
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [pending, startTransition] = useTransition();
  const run = (fn: () => Promise<{ error?: string }>, after?: () => void) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res.error) setError(res.error);
      else after?.();
    });
  };

  return (
    <div className="mt-3 space-y-2">
      {categories.map((c, i) => (
        <form
          key={c.id}
          action={(fd) => run(() => updateCategory(c.id, fd))}
          className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3"
        >
          <div className="flex flex-col">
            <button type="button" disabled={pending || i === 0} onClick={() => run(() => moveCategory(c.id, 'up'))} className="text-xs text-slate-500 disabled:opacity-30">▲</button>
            <button type="button" disabled={pending || i === categories.length - 1} onClick={() => run(() => moveCategory(c.id, 'down'))} className="text-xs text-slate-500 disabled:opacity-30">▼</button>
          </div>
          <span className="w-32 truncate text-xs text-slate-400" title={c.id}>
            /{c.id} · {c.articles}
          </span>
          <CategoryFields row={c} />
          <button disabled={pending} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">შენახვა</button>
          <button
            type="button"
            disabled={pending || c.articles > 0}
            title={c.articles > 0 ? 'ჯერ წაშალეთ სტატიები' : ''}
            onClick={async () => (await ask(`წავშალო კატეგორია „${c.title}“?`)) && run(() => deleteCategory(c.id))}
            className="rounded-lg px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-30"
          >
            წაშლა
          </button>
        </form>
      ))}

      {adding ? (
        <form action={(fd) => run(() => createCategory(fd), () => setAdding(false))} className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/40 p-3">
          <input name="id" required maxLength={40} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="მისამართი (my-topic)" className={`${input} w-44`} />
          <CategoryFields />
          <button disabled={pending} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">დამატება</button>
          <button type="button" onClick={() => setAdding(false)} className="text-sm text-slate-500">გაუქმება</button>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          + ახალი კატეგორია
        </button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

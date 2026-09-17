'use client';

import { useState, useTransition } from 'react';
import { ICON_KEYS } from './icons';
import {
  type ActionResult,
  createCategory,
  deleteCategory,
  toggleCategoryField,
  updateCategory,
} from './actions';

export type CategoryRow = {
  id: string;
  name: string;
  icon_key: string;
  sort_order: number;
  is_active: boolean;
  featured: boolean;
};

export function CategoriesTable({ categories }: { categories: CategoryRow[] }) {
  return (
    <div className="mt-6 space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">რიგი</th>
              <th className="px-4 py-3 font-medium">სახელი</th>
              <th className="px-4 py-3 font-medium">აიქონი</th>
              <th className="px-4 py-3 font-medium">აქტიური</th>
              <th className="px-4 py-3 font-medium">გამორჩეული</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((c) => (
              <CategoryRow key={c.id} category={c} />
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  კატეგორია არ მოიძებნა
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NewCategoryForm />
    </div>
  );
}

function CategoryRow({ category }: { category: CategoryRow }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <tr className="bg-blue-50/40">
        <td colSpan={6} className="px-4 py-3">
          <form
            action={(formData) => {
              setError(null);
              startTransition(async () => {
                const res = await updateCategory(category.id, formData);
                if (res.error) setError(res.error);
                else setEditing(false);
              });
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <div>
              <label className="block text-xs font-medium text-slate-500">ID</label>
              <input
                disabled
                value={category.id}
                className="mt-1 w-32 rounded-lg border border-slate-200 bg-slate-100 px-2 py-1.5 text-sm text-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">სახელი</label>
              <input
                name="name"
                defaultValue={category.name}
                required
                className="mt-1 w-48 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">აიქონი</label>
              <select
                name="icon_key"
                defaultValue={category.icon_key}
                className="mt-1 w-40 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {ICON_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500">რიგი</label>
              <input
                name="sort_order"
                type="number"
                defaultValue={category.sort_order}
                className="mt-1 w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                შენახვა
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                გაუქმება
              </button>
            </div>
            {error && <p className="w-full text-sm text-red-600">{error}</p>}
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-4 py-3 text-slate-500">{category.sort_order}</td>
      <td className="px-4 py-3 font-medium text-slate-900">
        {category.name}
        <span className="ml-2 text-xs font-normal text-slate-400">{category.id}</span>
      </td>
      <td className="px-4 py-3 text-slate-500">{category.icon_key}</td>
      <td className="px-4 py-3">
        <ToggleSwitch
          checked={category.is_active}
          onChange={(v) => toggleCategoryField(category.id, 'is_active', v)}
        />
      </td>
      <td className="px-4 py-3">
        <ToggleSwitch
          checked={category.featured}
          onChange={(v) => toggleCategoryField(category.id, 'featured', v)}
        />
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          რედაქტირება
        </button>
        <button
          onClick={() => {
            if (confirm(`წავშალო "${category.name}"?`)) {
              startTransition(async () => {
                await deleteCategory(category.id);
              });
            }
          }}
          className="ml-1 rounded-lg px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          წაშლა
        </button>
      </td>
    </tr>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => Promise<ActionResult>;
}) {
  const [value, setValue] = useState(checked);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const next = !value;
        setValue(next);
        startTransition(async () => {
          await onChange(next);
        });
      }}
      className={`h-5 w-9 rounded-full transition disabled:opacity-50 ${value ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <span
        className={`block h-4 w-4 translate-y-0.5 rounded-full bg-white transition ${value ? 'translate-x-4' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

function NewCategoryForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
      >
        + ახალი კატეგორია
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">ახალი კატეგორია</h2>
      <form
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            const res = await createCategory(formData);
            if (res.error) setError(res.error);
            else {
              setOpen(false);
              (document.getElementById('new-category-form') as HTMLFormElement)?.reset();
            }
          });
        }}
        id="new-category-form"
        className="mt-3 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="block text-xs font-medium text-slate-500">ID (ლათინურად)</label>
          <input
            name="id"
            placeholder="e.g. door_locks"
            required
            className="mt-1 w-40 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">სახელი</label>
          <input
            name="name"
            required
            className="mt-1 w-48 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">აიქონი</label>
          <select
            name="icon_key"
            defaultValue={ICON_KEYS[0]}
            className="mt-1 w-40 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {ICON_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">რიგი</label>
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            className="mt-1 w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            დამატება
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            გაუქმება
          </button>
        </div>
        {error && <p className="w-full text-sm text-red-600">{error}</p>}
      </form>
      <p className="mt-3 text-xs text-slate-400">
        ახალი კატეგორიის ფერი/ბექგრაუნდი აპში ავტომატურად ნეიტრალური იქნება (fallback), სანამ
        ostati-app-ის კოდში ცალკე არ დაემატება — ეს ცნობილი, დაგეგმილი შეზღუდვაა.
      </p>
    </div>
  );
}

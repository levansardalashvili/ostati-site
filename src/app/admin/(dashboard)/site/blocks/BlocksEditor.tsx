'use client';

import { ask } from '@/lib/dialog';
import { useState, useTransition } from 'react';
import { ICON_KEYS } from './icons';
import { createBlockItem, deleteBlockItem, moveBlockItem, updateBlockItem } from './actions';

export type BlockItem = {
  id: string;
  icon_key: string;
  title: string;
  description: string;
};

export function BlocksEditor({ blockKey, items }: { blockKey: string; items: BlockItem[] }) {
  return (
    <div className="mt-3 space-y-3">
      {items.map((item, i) => (
        <ItemRow
          key={item.id}
          blockKey={blockKey}
          item={item}
          isFirst={i === 0}
          isLast={i === items.length - 1}
        />
      ))}
      {items.length === 0 && <p className="text-sm text-slate-400">ელემენტი არ არის</p>}

      <NewItemForm blockKey={blockKey} />
    </div>
  );
}

function ItemRow({
  blockKey,
  item,
  isFirst,
  isLast,
}: {
  blockKey: string;
  item: BlockItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4">
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              const res = await updateBlockItem(item.id, blockKey, formData);
              if (res.error) setError(res.error);
              else setEditing(false);
            });
          }}
          className="space-y-3"
        >
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500">აიქონი</label>
              <select
                name="icon_key"
                defaultValue={item.icon_key}
                className="mt-1 w-40 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {ICON_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="block text-xs font-medium text-slate-500">სათაური</label>
              <input
                name="title"
                defaultValue={item.title}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500">აღწერა</label>
            <textarea
              name="description"
              defaultValue={item.description}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
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
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-1 pt-0.5">
        <button
          disabled={isFirst || pending}
          onClick={() =>
            startTransition(async () => {
              await moveBlockItem(blockKey, item.id, 'up');
            })
          }
          className="rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
          aria-label="ზემოთ"
        >
          ▲
        </button>
        <button
          disabled={isLast || pending}
          onClick={() =>
            startTransition(async () => {
              await moveBlockItem(blockKey, item.id, 'down');
            })
          }
          className="rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
          aria-label="ქვემოთ"
        >
          ▼
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{item.icon_key}</p>
        <p className="font-medium text-slate-900">{item.title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{item.description}</p>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          რედაქტირება
        </button>
        <button
          onClick={async () => {
            if (await ask(`წავშალო "${item.title}"?`)) {
              startTransition(async () => {
                await deleteBlockItem(item.id, blockKey);
              });
            }
          }}
          className="rounded-lg px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          წაშლა
        </button>
      </div>
    </div>
  );
}

function NewItemForm({ blockKey }: { blockKey: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
      >
        + ახალი ელემენტი
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <form
        id={`new-${blockKey}`}
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            const res = await createBlockItem(blockKey, formData);
            if (res.error) setError(res.error);
            else {
              setOpen(false);
              (document.getElementById(`new-${blockKey}`) as HTMLFormElement)?.reset();
            }
          });
        }}
        className="space-y-3"
      >
        <div className="flex flex-wrap gap-3">
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
          <div className="min-w-[200px] flex-1">
            <label className="block text-xs font-medium text-slate-500">სათაური</label>
            <input
              name="title"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">აღწერა</label>
          <textarea
            name="description"
            rows={2}
            className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
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
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </form>
    </div>
  );
}

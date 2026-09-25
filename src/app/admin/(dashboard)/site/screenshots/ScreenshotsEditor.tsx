'use client';

import { useRef, useState, useTransition } from 'react';
import { addScreenshot, deleteScreenshot, moveScreenshot } from './actions';

export type Shot = { id: string; url: string; alt: string };

export function ScreenshotsEditor({ shots }: { shots: Shot[] }) {
  const [msg, setMsg] = useState<{ kind: 'error' | 'warn'; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  // window.confirm ზოგ ბრაუზერში (მაგ. ჩაშენებულ პანელში) ჩუმად იბლოკება — წაშლა ორი დაჭერით დასტურდება
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const run = (fn: () => Promise<{ error?: string; warning?: string }>, after?: () => void) => {
    setMsg(null);
    startTransition(async () => {
      const res = await fn();
      if (res.error) setMsg({ kind: 'error', text: res.error });
      else {
        if (res.warning) setMsg({ kind: 'warn', text: res.warning });
        after?.();
      }
    });
  };

  return (
    <div className="mt-6 space-y-6">
      <form
        ref={formRef}
        action={(fd) => run(() => addScreenshot(fd), () => formRef.current?.reset())}
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div>
          <label className="block text-xs font-medium text-slate-500">ფოტო (PNG / JPG / WEBP, მაქს. 5 მბ)</label>
          <input type="file" name="file" accept="image/png,image/jpeg,image/webp" required className="mt-1 block text-sm" />
        </div>
        <div className="min-w-[14rem] flex-1">
          <label className="block text-xs font-medium text-slate-500">აღწერა (არასავალდებულო)</label>
          <input name="alt" maxLength={120} placeholder="მაგ: მთავარი ეკრანი" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <button disabled={pending} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {pending ? 'იტვირთება…' : 'დამატება'}
        </button>
      </form>

      {msg && (
        <p className={`rounded-lg px-4 py-2 text-sm ${msg.kind === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'}`}>{msg.text}</p>
      )}

      {shots.length === 0 ? (
        <p className="text-sm text-slate-500">ფოტო ჯერ არ არის დამატებული — საიტზე დროებითი დემო ეკრანები ჩანს.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shots.map((s, i) => (
            <li key={s.id} className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.url} alt={s.alt} className="aspect-[9/19.5] w-full rounded-lg bg-slate-100 object-cover object-top" />
              <p className="mt-2 truncate text-xs text-slate-500">
                {i < 2 ? <span className="font-semibold text-blue-600">მთავარ ეკრანზე · </span> : ''}
                {s.alt || '—'}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <button disabled={pending || i === 0} onClick={() => run(() => moveScreenshot(s.id, 'up'))} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-30">←</button>
                <button disabled={pending || i === shots.length - 1} onClick={() => run(() => moveScreenshot(s.id, 'down'))} className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-30">→</button>
                <button
                  disabled={pending}
                  onClick={() => {
                    if (confirmId !== s.id) return setConfirmId(s.id);
                    setConfirmId(null);
                    run(() => deleteScreenshot(s.id));
                  }}
                  onBlur={() => setConfirmId((c) => (c === s.id ? null : c))}
                  className={`ml-auto rounded border px-2 py-1 text-xs disabled:opacity-50 ${
                    confirmId === s.id ? 'border-red-600 bg-red-600 text-white' : 'border-red-300 text-red-700 hover:bg-red-50'
                  }`}
                >
                  {confirmId === s.id ? 'დარწმუნებული ხართ?' : 'წაშლა'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

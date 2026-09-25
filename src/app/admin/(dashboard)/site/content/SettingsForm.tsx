'use client';

import { useState, useTransition } from 'react';
import { SITE_TEXTS } from '@/lib/siteTexts';
import { updateSettings } from './actions';

const field = 'mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

// ველები SITE_TEXTS-იდან, ჯგუფებად — ახალი ტექსტის დამატება მხოლოდ src/lib/siteTexts.ts-შია საჭირო
export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const groups = [...new Set(SITE_TEXTS.map((t) => t.group))];

  return (
    <form
      action={(formData) => {
        setError(null);
        setSaved(false);
        startTransition(async () => {
          const res = await updateSettings(formData);
          if (res.error) setError(res.error);
          else setSaved(true);
        });
      }}
      className="mt-4 space-y-3"
    >
      {groups.map((group, i) => (
        <details key={group} open={i === 0} className="rounded-xl border border-slate-200">
          <summary className="cursor-pointer select-none rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800">
            {group}
          </summary>
          <div className="space-y-3 px-4 py-4">
            {SITE_TEXTS.filter((t) => t.group === group).map((t) => (
              <div key={t.key}>
                <label className="block text-xs font-medium text-slate-500">{t.label}</label>
                {t.multiline ? (
                  <textarea name={t.key} defaultValue={values[t.key] ?? ''} rows={2} placeholder={t.placeholder} className={field} />
                ) : (
                  <input name={t.key} defaultValue={values[t.key] ?? ''} placeholder={t.placeholder} className={field} />
                )}
                {t.hint && <p className="mt-0.5 text-xs text-slate-400">{t.hint}</p>}
              </div>
            ))}
          </div>
        </details>
      ))}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          შენახვა
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">შენახულია</span>}
        {error && <span className="text-sm font-medium text-red-600">{error}</span>}
      </div>
    </form>
  );
}

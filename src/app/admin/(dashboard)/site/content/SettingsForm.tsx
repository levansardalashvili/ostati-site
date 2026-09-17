'use client';

import { useState, useTransition } from 'react';
import { updateSettings } from './actions';

export function SettingsForm({
  playStoreUrl,
  appStoreUrl,
  contactEmail,
}: {
  playStoreUrl: string;
  appStoreUrl: string;
  contactEmail: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

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
      <div>
        <label className="block text-xs font-medium text-slate-500">Google Play ბმული</label>
        <input
          name="play_store_url"
          defaultValue={playStoreUrl}
          placeholder="https://play.google.com/store/apps/details?id=..."
          className="mt-1 w-full max-w-md rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500">App Store ბმული</label>
        <input
          name="app_store_url"
          defaultValue={appStoreUrl}
          placeholder="https://apps.apple.com/app/..."
          className="mt-1 w-full max-w-md rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500">საკონტაქტო ელფოსტა</label>
        <input
          name="contact_email"
          defaultValue={contactEmail}
          placeholder="info@ostati.ge"
          className="mt-1 w-full max-w-md rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          შენახვა
        </button>
        {saved && <span className="text-sm text-emerald-600">შენახულია</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  );
}

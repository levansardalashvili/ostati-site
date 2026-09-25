'use client';

import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { moderateProviderContent, removeJobPhoto } from './actions';

export type JobWithPhotos = {
  id: string;
  category: string;
  status: string;
  description: string;
  createdAt: string;
  photos: { ref: string; url: string | null }[];
};

const btn =
  'rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50';

function useModeration() {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const run = (fn: (reason: string | null) => Promise<{ error?: string; warning?: string }>) => {
    const reason = window.prompt('მოხსნის მიზეზი (ეცნობება მფლობელს, არასავალდებულო):');
    if (reason === null) return;
    setMsg(null);
    startTransition(async () => {
      const res = await fn(reason.trim() || null);
      setMsg(res.error ?? res.warning ?? null);
    });
  };
  return { msg, pending, run };
}

export function ProviderContent(props: {
  providerId: string;
  photoUrl: string | null;
  about: string;
  certificates: string[];
  portfolio: string[];
}) {
  const { msg, pending, run } = useModeration();
  const act = (action: 'photo' | 'about' | 'certificate' | 'portfolio', uri: string | null) =>
    run((reason) => moderateProviderContent(props.providerId, action, uri, reason));

  const Gallery = ({ items, kind }: { items: string[]; kind: 'certificate' | 'portfolio' }) =>
    items.length === 0 ? (
      <p className="text-sm text-slate-400">არ არის</p>
    ) : (
      <div className="flex flex-wrap gap-3">
        {items.map((u) => (
          <div key={u} className="w-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-28 w-28 rounded-lg object-cover" />
            <button type="button" disabled={pending} onClick={() => act(kind, u)} className={`${btn} mt-1 w-full`}>
              მოხსნა
            </button>
          </div>
        ))}
      </div>
    );

  return (
    <div className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">პროფილის კონტენტი</h2>
      {msg && <p className="text-sm font-medium text-amber-700">{msg}</p>}

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">პროფილის ფოტო</p>
        {props.photoUrl ? (
          <div className="w-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={props.photoUrl} alt="" className="h-28 w-28 rounded-lg object-cover" />
            <button type="button" disabled={pending} onClick={() => act('photo', props.photoUrl)} className={`${btn} mt-1 w-full`}>
              მოხსნა
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-400">არ არის</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">"ჩემს შესახებ"</p>
        {props.about ? (
          <>
            <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{props.about}</p>
            <button type="button" disabled={pending} onClick={() => act('about', null)} className={`${btn} mt-2`}>
              ტექსტის წაშლა
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-400">ცარიელია</p>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">სერთიფიკატები</p>
        <Gallery items={props.certificates} kind="certificate" />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">ნამუშევრები</p>
        <Gallery items={props.portfolio} kind="portfolio" />
      </div>
    </div>
  );
}

export function JobPhotos({ userId, jobs }: { userId: string; jobs: JobWithPhotos[] }) {
  const { msg, pending, run } = useModeration();
  if (jobs.length === 0) {
    return <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-400">განცხადება არ არის</div>;
  }
  return (
    <div className="mt-3 space-y-3">
      {msg && <p className="text-sm font-medium text-amber-700">{msg}</p>}
      {jobs.map((j) => (
        <div key={j.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-700">{j.description}</p>
          <p className="mt-1 text-xs text-slate-400">
            {j.status} · {formatDateTime(j.createdAt)}
          </p>
          {j.photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {j.photos.map((p) => (
                <div key={p.ref} className="w-24">
                  {p.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.url} alt="" className="h-24 w-24 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">ვერ ჩაიტვირთა</div>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run((reason) => removeJobPhoto(j.id, p.ref, userId, reason))}
                    className={`${btn} mt-1 w-full`}
                  >
                    მოხსნა
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { reviewVerification } from './actions';

export type PendingProvider = {
  id: string;
  name: string;
  specialty: string;
  areas: string;
  about: string;
  photoUrl: string | null;
  requestedAt: string | null;
};

export function VerificationQueue({ providers }: { providers: PendingProvider[] }) {
  if (providers.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
        მოლოდინში მყოფი მოთხოვნა არ არის
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {providers.map((p) => (
        <ProviderCard key={p.id} provider={p} />
      ))}
    </div>
  );
}

function ProviderCard({ provider }: { provider: PendingProvider }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<'verified' | 'rejected' | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 opacity-60 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          {provider.name} — {done === 'verified' ? 'დადასტურდა' : 'უარყოფილია'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {provider.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={provider.photoUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            ?
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-slate-900">{provider.name}</h2>
          <p className="text-sm text-slate-500">{provider.specialty || 'სპეციალობა არ არის მითითებული'}</p>
          <p className="text-xs text-slate-400">{provider.areas || 'არეალი არ არის მითითებული'}</p>
          {provider.about && <p className="mt-2 text-sm text-slate-600">{provider.about}</p>}
          {provider.requestedAt && (
            <p className="mt-2 text-xs text-slate-400">
              მოთხოვნილია: {formatDateTime(provider.requestedAt)}
            </p>
          )}
        </div>
      </div>

      {rejecting ? (
        <div className="mt-4 space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="უარყოფის მიზეზი (არასავალდებულო)"
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
          <div className="flex gap-2">
            <button
              disabled={pending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  const res = await reviewVerification(provider.id, false, reason);
                  if (res.error) setError(res.error);
                  else setDone('rejected');
                });
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              უარყოფის დადასტურება
            </button>
            <button
              onClick={() => setRejecting(false)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              გაუქმება
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <button
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const res = await reviewVerification(provider.id, true);
                if (res.error) setError(res.error);
                else setDone('verified');
              });
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            დადასტურება
          </button>
          <button
            disabled={pending}
            onClick={() => setRejecting(true)}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            უარყოფა
          </button>
          {error && <p className="self-center text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

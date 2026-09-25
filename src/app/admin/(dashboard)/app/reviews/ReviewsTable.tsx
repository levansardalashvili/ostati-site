'use client';

import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { setReviewHidden } from './actions';

export type ReviewRow = {
  id: string;
  providerName: string;
  stars: number;
  text: string;
  reply: string | null;
  hidden: boolean;
  createdAt: string;
};

export function ReviewsTable({ reviews }: { reviews: ReviewRow[] }) {
  if (reviews.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
        შეფასება არ არის
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-3">
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewRow }) {
  const [hidden, setHidden] = useState(review.hidden);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${hidden ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">
            {review.providerName} · {'★'.repeat(review.stars)}
            <span className="text-slate-300">{'★'.repeat(5 - review.stars)}</span>
          </p>
          {review.text && <p className="mt-2 text-sm text-slate-600">{review.text}</p>}
          {review.reply && <p className="mt-2 rounded-lg bg-slate-50 p-2 text-sm text-slate-500">პასუხი: {review.reply}</p>}
          <p className="mt-2 text-xs text-slate-400">{formatDateTime(review.createdAt)}</p>
        </div>
        {hidden && <span className="shrink-0 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">დამალული</span>}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          disabled={pending}
          onClick={() => {
            const next = !hidden;
            setHidden(next);
            setError(null);
            startTransition(async () => {
              const res = await setReviewHidden(review.id, next);
              if (res.error) {
                setError(res.error);
                setHidden(!next);
              }
            });
          }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          {hidden ? 'გამოჩენა' : 'დამალვა'}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}

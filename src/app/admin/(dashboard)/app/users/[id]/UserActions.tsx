'use client';

import { askText, ask } from '@/lib/dialog';
import { useState, useTransition } from 'react';
import { setUserSuspended, revokeVerification } from '../actions';
import { deleteUserAccount } from './actions';

const btn = 'rounded-lg border px-3 py-1.5 text-sm font-medium disabled:opacity-50';

export function UserActions({
  userId,
  role,
  suspended,
  verified,
}: {
  userId: string;
  role: string;
  suspended: boolean;
  verified: boolean;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const suspend = async () => {
    let reason: string | undefined;
    if (!suspended) {
      const entered = await askText('შეჩერების მიზეზი (მომხმარებელს ეცნობება, არასავალდებულო):');
      if (entered === null) return;
      reason = entered.trim() || undefined;
    } else if (!(await ask('ანგარიშის აღდგენა?'))) return;
    setMsg(null);
    startTransition(async () => setMsg((await setUserSuspended(userId, !suspended, reason)).error ?? null));
  };

  const revoke = async () => {
    const why = await askText('ვერიფიკაციის მოხსნის მიზეზი (არასავალდებულო):');
    if (why === null) return;
    setMsg(null);
    startTransition(async () => setMsg((await revokeVerification(userId, why.trim() || undefined)).error ?? null));
  };

  const remove = async () => {
    const ok = await ask(
      'ანგარიშის სამუდამო წაშლა?\n\nეს შეუქცევადია: პროფილი, ფოტოები, ჩატები და სელფი იშლება; დასრულებული სამუშაოები/შეფასებები ანონიმიზდება. დარწმუნდით, რომ მოთხოვნა ვინაობით დადასტურებულია.',
    );
    if (!ok) return;
    const why = await askText('წაშლის მიზეზი (ჟურნალში ჩაიწერება, არასავალდებულო):');
    if (why === null) return;
    setMsg(null);
    startTransition(async () => {
      const res = await deleteUserAccount(userId, why.trim() || null);
      if (res?.error) setMsg(res.error);
    });
  };

  if (role === 'admin') return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={suspend}
        className={`${btn} ${suspended ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
      >
        {suspended ? 'ანგარიშის აღდგენა' : 'ანგარიშის შეჩერება'}
      </button>
      {role === 'provider' && verified && (
        <button type="button" disabled={pending} onClick={revoke} className={`${btn} border-amber-300 text-amber-800 hover:bg-amber-50`}>
          ვერიფიკაციის მოხსნა
        </button>
      )}
      <button type="button" disabled={pending} onClick={remove} className={`${btn} border-red-700 bg-red-700 text-white hover:bg-red-800`}>
        ანგარიშის წაშლა
      </button>
      {msg && <span className="text-sm font-medium text-red-600">{msg}</span>}
    </div>
  );
}

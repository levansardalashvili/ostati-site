'use client';

import { askText } from '@/lib/dialog';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { formatDateTime } from '@/lib/format';
import { setUserSuspended, revokeVerification } from './actions';

export type UserRow = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  verified: boolean;
  suspended: boolean;
  suspensionReason: string | null;
};

const ROLE_LABEL: Record<string, string> = { customer: 'მომხმარებელი', provider: 'ოსტატი', admin: 'ადმინი' };

export function UsersTable({ users, limit }: { users: UserRow[]; limit: number }) {
  if (users.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
        მომხმარებელი ვერ მოიძებნა
      </div>
    );
  }
  return (
    <div className="mt-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">სახელი</th>
              <th className="px-4 py-3">როლი</th>
              <th className="px-4 py-3">კონტაქტი</th>
              <th className="px-4 py-3">რეგისტრაცია</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <UserRowView key={u.id} user={u} />
            ))}
          </tbody>
        </table>
      </div>
      {users.length === limit && <p className="mt-3 text-xs text-slate-400">ნაჩვენებია პირველი {limit} — დააზუსტეთ ძებნა.</p>}
    </div>
  );
}

function UserRowView({ user }: { user: UserRow }) {
  const [suspended, setSuspended] = useState(user.suspended);
  const [reason, setReason] = useState(user.suspensionReason);
  const [verified, setVerified] = useState(user.verified);

  const revoke = async () => {
    const why = await askText('ვერიფიკაციის მოხსნის მიზეზი (ეცნობება ოსტატს, არასავალდებულო):');
    if (why === null) return;
    setError(null);
    startTransition(async () => {
      const res = await revokeVerification(user.id, why.trim() || undefined);
      if (res.error) setError(res.error);
      else setVerified(false);
    });
  };
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = async () => {
    const next = !suspended;
    const entered = next ? await askText('შეჩერების მიზეზი (არასავალდებულო):') : null;
    if (next && entered === null) return; // prompt გაუქმდა
    setError(null);
    startTransition(async () => {
      const res = await setUserSuspended(user.id, next, entered?.trim() || undefined);
      if (res.error) {
        setError(res.error);
      } else {
        setSuspended(next);
        setReason(next ? entered?.trim() || null : null);
      }
    });
  };

  return (
    <tr>
      <td className="px-4 py-3">
        <p className="font-medium text-slate-900">
          <Link href={`/admin/app/users/${user.id}`} className="hover:text-blue-600 hover:underline">
            {user.name}
          </Link>
          {verified && <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">ვერიფიცირებული</span>}
        </p>
        {suspended && (
          <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            შეჩერებული{reason ? `: ${reason}` : ''}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-slate-600">{ROLE_LABEL[user.role] ?? user.role}</td>
      <td className="px-4 py-3 text-slate-600">
        <p>{user.email || '—'}</p>
        {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
      </td>
      <td className="px-4 py-3 text-slate-500">{formatDateTime(user.createdAt)}</td>
      <td className="px-4 py-3 text-right">
        {verified && (
          <button
            type="button"
            disabled={pending}
            onClick={revoke}
            className="mr-2 rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
          >
            ვერიფიკაციის მოხსნა
          </button>
        )}
        {user.role !== 'admin' && (
          <button
            type="button"
            disabled={pending}
            onClick={toggle}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${
              suspended ? 'border-slate-300 text-slate-700 hover:bg-slate-50' : 'border-red-300 text-red-700 hover:bg-red-50'
            }`}
          >
            {suspended ? 'აღდგენა' : 'შეჩერება'}
          </button>
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
    </tr>
  );
}

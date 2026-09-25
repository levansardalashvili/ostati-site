'use client';

import { useState, useTransition } from 'react';
import { sendBroadcast } from './actions';

const AUDIENCES = [
  { value: 'all', label: 'ყველა' },
  { value: 'customer', label: 'მხოლოდ მომხმარებლები' },
  { value: 'provider', label: 'მხოლოდ ოსტატები' },
];

export function BroadcastForm({ counts }: { counts: { customer: number; provider: number } }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const recipients = audience === 'all' ? counts.customer + counts.provider : counts[audience as 'customer' | 'provider'];
  const valid = title.trim().length > 0 && title.length <= 80 && body.trim().length > 0 && body.length <= 300;

  const send = () => {
    if (!window.confirm(`გაიგზავნება ${recipients} მომხმარებელზე:\n\n${title.trim()}\n${body.trim()}\n\nგაგრძელება?`)) return;
    setMsg(null);
    startTransition(async () => {
      const res = await sendBroadcast(title, body, audience);
      if (res.error) {
        setMsg({ ok: false, text: res.error });
      } else {
        setMsg({ ok: true, text: `გაიგზავნა ${res.sent} მიმღებზე` });
        setTitle('');
        setBody('');
      }
    });
  };

  const input =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

  return (
    <div className="mt-6 max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <label className="text-sm font-medium text-slate-700">სათაური</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} className={`${input} mt-1`} />
        <p className="mt-1 text-xs text-slate-400">{title.length}/80</p>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">ტექსტი</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={300} rows={4} className={`${input} mt-1`} />
        <p className="mt-1 text-xs text-slate-400">{body.length}/300</p>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">ვის გაუგზავნოთ</label>
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className={`${input} mt-1`}>
          {AUDIENCES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-400">მიმღები: {recipients}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!valid || pending || recipients === 0}
          onClick={send}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
        >
          {pending ? 'იგზავნება...' : 'გაგზავნა'}
        </button>
        {msg && <span className={`text-sm font-medium ${msg.ok ? 'text-emerald-600' : 'text-red-600'}`}>{msg.text}</span>}
      </div>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { saveSetting } from './actions';

export type SettingRow = {
  key: string;
  value: number | null;
  label: string;
  hint: string;
  unit: string;
  min: number;
  max: number;
};

export function LimitsForm({ rows }: { rows: SettingRow[] }) {
  return (
    <div className="mt-6 space-y-3">
      {rows.map((r) => (
        <SettingCard key={r.key} row={r} />
      ))}
    </div>
  );
}

function SettingCard({ row }: { row: SettingRow }) {
  const [saved, setSaved] = useState(row.value);
  const [text, setText] = useState(row.value === null ? '' : String(row.value));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const num = Number(text);
  const valid = text.trim() !== '' && Number.isInteger(num) && num >= row.min && num <= row.max;
  const dirty = valid && num !== saved;

  const save = () => {
    setMsg(null);
    startTransition(async () => {
      const res = await saveSetting(row.key, num);
      if (res.error) setMsg({ ok: false, text: res.error });
      else {
        setSaved(num);
        setMsg({ ok: true, text: 'შენახულია' });
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 max-w-xl">
          <p className="font-semibold text-slate-900">{row.label}</p>
          <p className="mt-1 text-sm text-slate-500">{row.hint}</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={row.min}
            max={row.max}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setMsg(null);
            }}
            className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-500">{row.unit}</span>
          <button
            type="button"
            disabled={!dirty || pending}
            onClick={save}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            შენახვა
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        დასაშვებია {row.min}–{row.max}
        {msg && <span className={`ml-3 font-medium ${msg.ok ? 'text-emerald-600' : 'text-red-600'}`}>{msg.text}</span>}
        {!valid && text.trim() !== '' && <span className="ml-3 font-medium text-red-600">მნიშვნელობა დიაპაზონს სცილდება</span>}
      </p>
    </div>
  );
}

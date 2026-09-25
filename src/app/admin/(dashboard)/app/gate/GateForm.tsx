'use client';

import { useState, useTransition } from 'react';
import { saveGate } from './actions';

export type Gate = { min_version: string; maintenance: boolean; maintenance_message: string; update_url: string };

const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

export function GateForm({ initial }: { initial: Gate }) {
  const [minVersion, setMinVersion] = useState(initial.min_version);
  const [maintenance, setMaintenance] = useState(initial.maintenance);
  const [message, setMessage] = useState(initial.maintenance_message);
  const [url, setUrl] = useState(initial.update_url);
  const [saved, setSaved] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const versionOk = minVersion.trim() === '' || /^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(minVersion.trim());
  const dirty =
    minVersion.trim() !== saved.min_version || maintenance !== saved.maintenance ||
    message.trim() !== saved.maintenance_message || url.trim() !== saved.update_url;

  const save = () => {
    const warn =
      (maintenance && !saved.maintenance
        ? 'ტექნიკური რეჟიმის ჩართვა ყველა მომხმარებელს დაუბლოკავს აპს. გაგრძელება?'
        : '') ||
      (minVersion.trim() && minVersion.trim() !== saved.min_version
        ? `${minVersion.trim()}-ზე ძველი ვერსიის მომხმარებლებს აპი დაებლოკებათ და განახლება მოეთხოვებათ. გაგრძელება?`
        : '');
    if (warn && !window.confirm(warn)) return;
    setMsg(null);
    startTransition(async () => {
      const res = await saveGate(minVersion.trim(), maintenance, message.trim(), url.trim());
      if (res.error) setMsg({ ok: false, text: res.error });
      else {
        setSaved({ min_version: minVersion.trim(), maintenance, maintenance_message: message.trim(), update_url: url.trim() });
        setMsg({ ok: true, text: 'შენახულია' });
      }
    });
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} className="h-4 w-4" />
          <span className="font-semibold text-slate-900">ტექნიკური რეჟიმი</span>
          {maintenance && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">ჩართულია</span>}
        </label>
        <p className="mt-1 text-sm text-slate-500">
          ჩართვისას ყველა მომხმარებელს აპში სრულეკრანიანი შეტყობინება ჩანს და ვერაფერს აკეთებს (შემოწმება გაშვებისას და
          ფონიდან დაბრუნებისას). ადმინ-პანელზე გავლენა არ აქვს.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={200}
          rows={2}
          placeholder="ტექსტი მომხმარებლისთვის (არასავალდებულო, მაქს. 200 სიმბოლო)"
          className={`${input} mt-3`}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-semibold text-slate-900">მინიმალური ვერსია</p>
        <p className="mt-1 text-sm text-slate-500">
          ამ ვერსიაზე ძველ აპს განახლება მოეთხოვება. ცარიელი = შეზღუდვა არ არის. გამოიყენეთ მხოლოდ მას შემდეგ, რაც ახალი
          ვერსია მაღაზიაში უკვე გამოქვეყნებულია.
        </p>
        <input
          value={minVersion}
          onChange={(e) => setMinVersion(e.target.value)}
          placeholder="მაგ. 1.2.0"
          className={`${input} mt-3 max-w-xs`}
        />
        {!versionOk && <p className="mt-1 text-xs text-red-600">ფორმატი: 1.2.3</p>}
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="განახლების ბმული (https://... ან market://...) — არასავალდებულო"
          className={`${input} mt-3`}
        />
        <p className="mt-1 text-xs text-slate-400">
          თუ ბმული მითითებულია, განახლების ეკრანზე ღილაკი ამ მისამართს გახსნის.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!dirty || !versionOk || pending}
          onClick={save}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
        >
          შენახვა
        </button>
        {msg && <span className={`text-sm font-medium ${msg.ok ? 'text-emerald-600' : 'text-red-600'}`}>{msg.text}</span>}
      </div>
    </div>
  );
}

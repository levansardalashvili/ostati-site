'use client';

import { useState, useTransition } from 'react';
import { addDistrict, setDistrictActive } from './actions';

export type RegionGroup = { id: string; label: string; districts: { id: string; name: string; active: boolean }[] };

const inputCls =
  'rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';

export function RegionsEditor({ regions }: { regions: RegionGroup[] }) {
  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const addRegion = () => {
    setMsg(null);
    startTransition(async () => {
      const res = await addDistrict(newId.trim(), newLabel.trim(), newDistrict.trim());
      if (res.error) setMsg(res.error);
      else {
        setNewId('');
        setNewLabel('');
        setNewDistrict('');
      }
    });
  };

  return (
    <div className="mt-6 space-y-4">
      {regions.map((r) => (
        <RegionCard key={r.id} region={r} />
      ))}

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5">
        <p className="font-semibold text-slate-900">ახალი მხარე</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input value={newId} onChange={(e) => setNewId(e.target.value)} placeholder="id (ლათინურად, მაგ. new-region)" className={`${inputCls} w-64`} />
          <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="სახელი" className={`${inputCls} w-48`} />
          <input value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} placeholder="პირველი რაიონი/ქალაქი" className={`${inputCls} w-56`} />
          <button
            type="button"
            disabled={pending || !newId.trim() || !newLabel.trim() || !newDistrict.trim()}
            onClick={addRegion}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            დამატება
          </button>
        </div>
        {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
      </div>
    </div>
  );
}

function RegionCard({ region }: { region: RegionGroup }) {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const add = () => {
    setMsg(null);
    startTransition(async () => {
      const res = await addDistrict(region.id, null, name.trim());
      if (res.error) setMsg(res.error);
      else setName('');
    });
  };
  const toggle = (id: string, active: boolean) => {
    setMsg(null);
    startTransition(async () => {
      const res = await setDistrictActive(id, active);
      if (res.error) setMsg(res.error);
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-semibold text-slate-900">
        {region.label} <span className="text-xs font-normal text-slate-400">({region.id})</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {region.districts.map((d) => (
          <button
            key={d.id}
            type="button"
            disabled={pending}
            onClick={() => toggle(d.id, !d.active)}
            title={d.active ? 'დააჭირეთ გამოსართავად' : 'დააჭირეთ ჩასართავად'}
            className={`rounded-full border px-3 py-1 text-sm disabled:opacity-50 ${
              d.active
                ? 'border-slate-300 bg-white text-slate-700 hover:bg-red-50'
                : 'border-slate-200 bg-slate-100 text-slate-400 line-through hover:bg-emerald-50'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ახალი რაიონი/ქალაქი" className={`${inputCls} w-64`} />
        <button
          type="button"
          disabled={pending || !name.trim()}
          onClick={add}
          className="rounded-lg border border-blue-300 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-40"
        >
          დამატება
        </button>
      </div>
      {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
    </div>
  );
}

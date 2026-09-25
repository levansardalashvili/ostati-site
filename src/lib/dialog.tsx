'use client';

import { useState } from 'react';
import { createRoot } from 'react-dom/client';

// window.confirm/prompt ზოგ ბრაუზერში (მაგ. ჩაშენებულ პანელში) ჩუმად იბლოკება და ღილაკი არაფერს აკეთებს —
// ამიტომ საკუთარი დიალოგი. ask → true/false, askText → ტექსტი (ცარიელიც შეიძლება) ან null გაუქმებაზე.
type Opts = { message: string; withInput: boolean; resolve: (v: string | null) => void };

function Dialog({ message, withInput, resolve }: Opts) {
  const [value, setValue] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          resolve(withInput ? value : 'ok');
        }}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
      >
        <p className="whitespace-pre-line text-sm text-slate-800">{message}</p>
        {withInput && (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        )}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => resolve(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            გაუქმება
          </button>
          <button autoFocus={!withInput} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            დადასტურება
          </button>
        </div>
      </form>
    </div>
  );
}

function open(message: string, withInput: boolean): Promise<string | null> {
  return new Promise((resolve) => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    const done = (v: string | null) => {
      root.unmount();
      host.remove();
      resolve(v);
    };
    root.render(<Dialog message={message} withInput={withInput} resolve={done} />);
  });
}

export const ask = async (message: string) => (await open(message, false)) !== null;
export const askText = (message: string) => open(message, true);

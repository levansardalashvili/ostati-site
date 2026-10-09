import { createClient } from '@/lib/supabase-admin/server';
import { formatDateTime } from '@/lib/format';

// App crash/error log (ostati-app 0154 `client_errors`) — newest 100.
export default async function ErrorsPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from('client_errors')
    .select('id, created_at, user_id, message, stack, context, is_fatal, app_version, platform')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">აპის შეცდომები</h1>
      <p className="mt-1 text-sm text-slate-500">
        აპში მომხდარი JS შეცდომები (ბოლო 100). „-dev“ პლატფორმა = დეველოპმენტის build.
      </p>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : !rows?.length ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
          შეცდომები არ არის
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <details key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  {r.is_fatal && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 font-semibold text-red-700">fatal</span>
                  )}
                  <span>{formatDateTime(r.created_at)}</span>
                  <span>· {r.platform ?? '—'}</span>
                  <span>· v{r.app_version ?? '—'}</span>
                  {r.context && <span>· {r.context.split(':')[0]}</span>}
                </div>
                <p className="mt-1 break-words font-mono text-sm text-slate-900">{r.message}</p>
              </summary>
              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <p>მომხმარებელი: {r.user_id ?? 'შესვლამდე'}</p>
                {r.context && <p className="break-words">კონტექსტი: {r.context}</p>}
                {r.stack && (
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 font-mono">
                    {r.stack}
                  </pre>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

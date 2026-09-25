import { createClient } from '@/lib/supabase-admin/server';
import { formatDateTime } from '@/lib/format';
import { BroadcastForm } from './BroadcastForm';

const AUDIENCE_LABEL: Record<string, string> = { all: 'ყველა', customer: 'მომხმარებლები', provider: 'ოსტატები' };

export default async function BroadcastsPage() {
  const supabase = await createClient();
  const head = (role: string) =>
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', role).is('suspended_at', null);

  const [customers, providers, { data: history, error }] = await Promise.all([
    head('customer'),
    head('provider'),
    supabase
      .from('admin_broadcasts')
      .select('id, title, body, audience, recipient_count, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const counts = { customer: customers.count ?? 0, provider: providers.count ?? 0 };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">შეტყობინების გაგზავნა</h1>
      <p className="mt-1 text-sm text-slate-500">
        შეტყობინება ეგზავნება აპში (და push-ით, თუ მოწყობილობა დარეგისტრირებულია). შეჩერებული ანგარიშები და ადმინები გამოტოვებულია. გაგზავნის შემდეგ გაუქმება შეუძლებელია.
      </p>

      <BroadcastForm counts={counts} />

      <h2 className="mt-10 text-lg font-semibold text-slate-900">გაგზავნილი შეტყობინებები</h2>
      {error ? (
        <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (history ?? []).length === 0 ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-400">ჯერ არაფერი გაგზავნილა</div>
      ) : (
        <div className="mt-3 space-y-3">
          {(history ?? []).map((b) => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-slate-900">{b.title}</p>
              <p className="mt-1 text-sm text-slate-600">{b.body}</p>
              <p className="mt-2 text-xs text-slate-400">
                {AUDIENCE_LABEL[b.audience] ?? b.audience} · {b.recipient_count} მიმღები · {formatDateTime(b.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

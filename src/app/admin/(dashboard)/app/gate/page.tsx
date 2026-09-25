import { createClient } from '@/lib/supabase-admin/server';
import { GateForm, type Gate } from './GateForm';

export default async function GatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('app_gate')
    .select('min_version, maintenance, maintenance_message, update_url')
    .eq('id', 1)
    .maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">ვერსია და ტექნიკური რეჟიმი</h1>
      <p className="mt-1 text-sm text-slate-500">აპის ხელმისაწვდომობის მართვა მაღაზიის განახლების გარეშე.</p>
      {error || !data ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა{error ? `: ${error.message}` : ''}</div>
      ) : (
        <GateForm initial={data as Gate} />
      )}
    </div>
  );
}

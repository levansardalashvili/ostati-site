import { createClient } from '@/lib/supabase-admin/server';
import { VerificationQueue, type PendingProvider } from './VerificationQueue';

export default async function VerificationPage() {
  const supabase = await createClient();

  const { data: providers, error } = await supabase
    .from('provider_profiles')
    .select('id, first_name, last_name, specialty, areas, about, photo_url')
    .eq('verification_status', 'pending');

  const providerIds = (providers ?? []).map((p) => p.id);
  const { data: requests } = providerIds.length
    ? await supabase
        .from('provider_verification_requests')
        .select('provider_id, requested_at')
        .in('provider_id', providerIds)
    : { data: [] };

  const requestedAtByProvider = Object.fromEntries((requests ?? []).map((r) => [r.provider_id, r.requested_at]));

  const rows: PendingProvider[] = (providers ?? [])
    .map((p) => ({
      id: p.id,
      name: `${p.first_name} ${p.last_name}`.trim() || '(უსახელო)',
      specialty: (p.specialty ?? []).map((s: { label: string }) => s.label).join(', '),
      areas: (p.areas ?? []).join(', '),
      about: p.about,
      photoUrl: p.photo_url,
      requestedAt: requestedAtByProvider[p.id] ?? null,
    }))
    .sort((a, b) => (a.requestedAt ?? '').localeCompare(b.requestedAt ?? ''));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">ვერიფიკაციები</h1>
      <p className="mt-1 text-sm text-slate-500">
        ოსტატები, რომლებმაც მოითხოვეს ვერიფიცირებული სტატუსი — დაადასტურეთ ან უარყავით.
      </p>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          ვერ ჩაიტვირთა: {error.message}
        </div>
      ) : (
        <VerificationQueue providers={rows} />
      )}
    </div>
  );
}

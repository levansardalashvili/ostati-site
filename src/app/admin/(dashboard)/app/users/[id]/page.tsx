import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-admin/server';
import { formatDateTime } from '@/lib/format';
import { ProviderContent, JobPhotos, type JobWithPhotos } from './ContentPanels';
import { UserActions } from './UserActions';

type MediaItem = { id: number; uri?: string };

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: user } = await supabase
    .from('users')
    .select('id, role, first_name, last_name, email, phone, created_at, suspended_at, suspension_reason')
    .eq('id', id)
    .maybeSingle();
  if (!user) notFound();

  const { data: profile } =
    user.role === 'provider'
      ? await supabase
          .from('provider_profiles')
          .select('photo_url, about, certificates, portfolio, verification_status')
          .eq('id', id)
          .maybeSingle()
      : { data: null };

  const { data: jobs } = await supabase
    .from('job_posts')
    .select('id, category, status, description, photos, created_at')
    .or(`customer_id.eq.${id},provider_id.eq.${id}`)
    .order('created_at', { ascending: false })
    .limit(10);

  // სტატისტიკა
  const { data: allJobs } = await supabase
    .from('job_posts')
    .select('status')
    .or(`customer_id.eq.${id},provider_id.eq.${id}`)
    .limit(1000);
  const byStatus = new Map<string, number>();
  for (const j of allJobs ?? []) byStatus.set(j.status, (byStatus.get(j.status) ?? 0) + 1);
  const { data: statsRows } =
    user.role === 'provider' ? await supabase.rpc('get_provider_stats', { p_provider_id: id }) : { data: null };
  const stats = Array.isArray(statsRows) ? statsRows[0] : statsRows;

  // რეპორტები ამ მომხმარებელზე და მისგან
  const repSel = 'id, reporter_id, reported_user_id, reason, status, created_at';
  const [jr, cr] = await Promise.all([
    supabase.from('job_reports').select(repSel).or(`reporter_id.eq.${id},reported_user_id.eq.${id}`).order('created_at', { ascending: false }).limit(10),
    supabase.from('chat_reports').select(repSel).or(`reporter_id.eq.${id},reported_user_id.eq.${id}`).order('created_at', { ascending: false }).limit(10),
  ]);
  const reports = [
    ...(jr.data ?? []).map((r) => ({ ...r, kind: 'განცხადება' })),
    ...(cr.data ?? []).map((r) => ({ ...r, kind: 'ჩატი' })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const { data: audit } = await supabase
    .from('admin_audit_log')
    .select('id, action, details, created_at')
    .eq('target_id', id)
    .order('created_at', { ascending: false })
    .limit(10);

  // კერძო ფოტოებისთვის signed URL (ადმინის საკუთარი სესიით, 0116 policy)
  const jobRows: JobWithPhotos[] = await Promise.all(
    (jobs ?? []).map(async (j) => ({
      id: j.id,
      category: j.category,
      status: j.status,
      description: j.description,
      createdAt: j.created_at,
      photos: await Promise.all(
        ((j.photos ?? []) as string[]).map(async (ref) => {
          if (ref.startsWith('private-media://')) {
            const { data } = await supabase.storage.from('private-media').createSignedUrl(ref.slice('private-media://'.length), 900);
            return { ref, url: data?.signedUrl ?? null };
          }
          return { ref, url: ref };
        }),
      ),
    })),
  );

  return (
    <div>
      <Link href="/admin/app/users" className="text-sm text-blue-600 hover:underline">
        ← მომხმარებლები
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">
        {`${user.first_name} ${user.last_name}`.trim() || '(უსახელო)'}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {user.role === 'provider' ? 'ოსტატი' : user.role === 'customer' ? 'მომხმარებელი' : 'ადმინი'} · {user.email || '—'}
        {user.phone ? ` · ${user.phone}` : ''} · რეგისტრაცია {formatDateTime(user.created_at)}
        {user.suspended_at ? ` · შეჩერებულია${user.suspension_reason ? `: ${user.suspension_reason}` : ''}` : ''}
      </p>

      <UserActions
        userId={user.id}
        role={user.role}
        suspended={!!user.suspended_at}
        verified={profile?.verification_status === 'verified'}
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {profile && (
          <>
            <Stat label="ვერიფიკაცია" value={profile.verification_status} />
            <Stat label="რეიტინგი" value={stats ? `${stats.avg_rating} (${stats.review_count} შეფ.)` : '—'} />
            <Stat label="დასრულებული სამუშაო" value={String(stats?.completed_jobs ?? 0)} />
          </>
        )}
        <Stat label="განცხადებები სულ" value={String(allJobs?.length ?? 0)} />
        {[...byStatus.entries()].map(([st, n]) => (
          <Stat key={st} label={st} value={String(n)} />
        ))}
      </div>

      {profile && (
        <ProviderContent
          providerId={user.id}
          photoUrl={profile.photo_url}
          about={profile.about}
          certificates={((profile.certificates ?? []) as MediaItem[]).filter((c) => !!c.uri).map((c) => c.uri as string)}
          portfolio={((profile.portfolio ?? []) as MediaItem[]).filter((c) => !!c.uri).map((c) => c.uri as string)}
        />
      )}

      <h2 className="mt-10 text-lg font-semibold text-slate-900">რეპორტები</h2>
      {reports.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">არ არის</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {reports.map((r) => (
            <li key={r.kind + r.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
              <span className="font-medium text-slate-800">{r.kind}</span>
              <span className="text-slate-500"> · {r.reported_user_id === id ? 'ამ მომხმარებელზე' : 'ამ მომხმარებლისგან'} · {r.reason} · {r.status} · {formatDateTime(r.created_at)}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-lg font-semibold text-slate-900">ადმინის მოქმედებები ამ მომხმარებელზე</h2>
      {(audit ?? []).length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">არ არის</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {(audit ?? []).map((a) => (
            <li key={a.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
              <span className="font-medium text-slate-800">{a.action}</span>
              <span className="text-slate-500"> · {formatDateTime(a.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-slate-400"><Link href="/admin/app/audit" className="text-blue-600 hover:underline">სრული ჟურნალი →</Link></p>

      <h2 className="mt-10 text-lg font-semibold text-slate-900">განცხადებები (ბოლო 10)</h2>
      <JobPhotos userId={user.id} jobs={jobRows} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

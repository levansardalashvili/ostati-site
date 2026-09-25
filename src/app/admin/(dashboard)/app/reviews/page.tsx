import { createClient } from '@/lib/supabase-admin/server';
import { ReviewsTable, type ReviewRow } from './ReviewsTable';

export default async function ReviewsPage() {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('id, provider_id, stars, review_text, provider_reply, hidden, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  const providerIds = Array.from(new Set((reviews ?? []).map((r) => r.provider_id)));
  const { data: users } = providerIds.length
    ? await supabase.from('users').select('id, first_name, last_name, email').in('id', providerIds)
    : { data: [] };
  const nameById = Object.fromEntries(
    (users ?? []).map((u) => [u.id, `${u.first_name} ${u.last_name}`.trim() || u.email]),
  );

  const rows: ReviewRow[] = (reviews ?? []).map((r) => ({
    id: r.id,
    providerName: nameById[r.provider_id] ?? r.provider_id,
    stars: r.stars,
    text: r.review_text ?? '',
    reply: r.provider_reply,
    hidden: r.hidden,
    createdAt: r.created_at,
  }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">შეფასებები</h1>
      <p className="mt-1 text-sm text-slate-500">
        შეფასებები ანონიმურია. დამალული შეფასება საჯაროდ აღარ ჩანს და რეიტინგში არ ითვლება.
      </p>
      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <ReviewsTable reviews={rows} />
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase-admin/server';
import { LimitsForm, type SettingRow } from './LimitsForm';

// დიაპაზონები ზუსტად admin_set_app_setting()-ის (0113) იგივეა — სერვერი მაინც ამოწმებს
const META: Record<string, { label: string; hint: string; unit: string; min: number; max: number }> = {
  max_open_jobs: { label: 'ღია განცხადებების ლიმიტი', hint: 'ერთ მომხმარებელს ერთდროულად რამდენი დრაფტ/მომლოდინე განცხადება შეიძლება ჰქონდეს', unit: 'განცხადება', min: 1, max: 50 },
  job_expiry_days: { label: 'განცხადების ვადა', hint: 'მომლოდინე განცხადება ამდენი დღის შემდეგ ავტომატურად იხურება (შეხსენება ვადამდე 3 დღით ადრე)', unit: 'დღე', min: 7, max: 90 },
  dispute_limit: { label: 'დავის ლიმიტი', hint: 'ერთ განცხადებაზე რამდენჯერ შეიძლება „პრობლემა მაქვს“-ის დაფიქსირება', unit: 'ჯერ', min: 1, max: 10 },
  offer_expiry_days: { label: 'ფასის შეთავაზების ვადა', hint: 'ჩატში გაგზავნილი შეთავაზების დათანხმება ამდენი დღის შემდეგ აღარ შეიძლება', unit: 'დღე', min: 1, max: 30 },
  confirmation_grace_hours: { label: 'ავტო-დადასტურება', hint: 'ოსტატის „დავასრულეო“-ს შემდეგ, თუ მომხმარებელი ამდენ საათში არ პასუხობს, სამუშაო ავტომატურად დასტურდება', unit: 'საათი', min: 12, max: 336 },
  rating_prior_count: { label: 'რეიტინგი: „ვირტუალური“ ხმები', hint: 'რაც მეტია, მით უფრო ნელა გადაწონის მცირერიცხოვანი შეფასება ბაზისურ საშუალოს (ერთი 5★ ვერ გაუსწრებს ასობით კარგს). ოსტატების „ტოპ“ სიის დალაგებას ეხება', unit: 'ხმა', min: 1, max: 100 },
  rating_prior_mean_x10: { label: 'რეიტინგი: ბაზისური საშუალო ×10', hint: 'ახალი/ცოტა შეფასების მქონე ოსტატის საწყისი საშუალო. 43 = 4.3★', unit: '×10', min: 30, max: 50 },
  ranking_jobs_weight_x100: { label: 'რანჟირება: დასრულებული სამუშაოების წონა ×100', hint: 'რამდენად ამაღლებს ოსტატს დასრულებული სამუშაოების რაოდენობა. 15 = 0.15', unit: '×100', min: 1, max: 50 },
  stale_interest_hours: { label: '„არავინ დაინტერესდა“ შეხსენება', hint: 'ამდენი საათის შემდეგ ნულოვანი დაინტერესების მქონე განცხადებაზე მომხმარებელს ეგზავნება შეხსენება', unit: 'საათი', min: 12, max: 336 },
};

export default async function LimitsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('app_settings').select('key, value');
  const values = Object.fromEntries((data ?? []).map((r) => [r.key, r.value as number]));
  const rows: SettingRow[] = Object.entries(META).map(([key, m]) => ({ key, value: values[key] ?? null, ...m }));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">ლიმიტები და ვადები</h1>
      <p className="mt-1 text-sm text-slate-500">
        ცვლილება მოქმედებს დაუყოვნებლივ, აპის განახლების გარეშე. დროზე დამოკიდებული წესები ყოველ 15 წუთში მოწმდება.
      </p>
      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <LimitsForm rows={rows} />
      )}
    </div>
  );
}

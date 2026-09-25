import { createClient } from '@/lib/supabase-admin/server';
import { RegionsEditor, type RegionGroup } from './RegionsEditor';

export default async function RegionsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('region_districts')
    .select('id, region_id, region_label, region_sort, district, sort_order, is_active')
    .order('region_sort')
    .order('sort_order');

  const groups = new Map<string, RegionGroup>();
  for (const r of data ?? []) {
    const g: RegionGroup = groups.get(r.region_id) ?? { id: r.region_id, label: r.region_label, districts: [] };
    g.districts.push({ id: r.id, name: r.district, active: r.is_active });
    groups.set(r.region_id, g);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">რეგიონები და რაიონები</h1>
      <p className="mt-1 text-sm text-slate-500">
        სია, საიდანაც ოსტატი სამუშაო არეალს ირჩევს და მომხმარებელი განცხადების რაიონს. სახელი არ იცვლება და არ იშლება
        (ის უკვე შენახულია პროფილებსა და განცხადებებში) — მხოლოდ ემატება ან გამოირთვება; გამორთული აღარ ჩანს არჩევისას,
        არსებულ ჩანაწერებზე გავლენა არ აქვს.
      </p>
      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (
        <RegionsEditor regions={[...groups.values()]} />
      )}
    </div>
  );
}

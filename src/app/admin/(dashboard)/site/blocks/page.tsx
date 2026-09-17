import { createClient } from '@/lib/supabase-admin/server';
import { BlocksEditor, type BlockItem } from './BlocksEditor';

const GROUPS = [
  { key: 'home_features', label: 'Feature-ბარათები (მთავარი გვერდი)' },
  { key: 'how_it_works_steps', label: '"როგორ მუშაობს" ნაბიჯები' },
];

export default async function SiteBlocksPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_blocks')
    .select('id, block_key, icon_key, title, description')
    .order('sort_order', { ascending: true });

  const items = (data ?? []) as (BlockItem & { block_key: string })[];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">გვერდის სექციები</h1>
      <p className="mt-1 text-sm text-slate-500">
        მთავარი გვერდის feature-ბარათები და "როგორ მუშაობს"-ის ნაბიჯები — დამატება/წაშლა/რიგითობა.
      </p>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          ვერ ჩაიტვირთა: {error.message}
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {GROUPS.map((g) => (
            <div key={g.key}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{g.label}</h2>
              <BlocksEditor blockKey={g.key} items={items.filter((i) => i.block_key === g.key)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase-admin/server';
import { CategoriesTable, type CategoryRow } from './CategoriesTable';

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, icon_key, sort_order, is_active, featured, price_per_sqm')
    .order('sort_order', { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">კატეგორიები</h1>
      <p className="mt-1 text-sm text-slate-500">
        სერვისის კატეგორიების მართვა — ცვლილება მყისიერად აისახება Ostati-ის აპშიც და{' '}
        <a href="https://ostati.ge/services" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
          ostati.ge/services
        </a>
        -ზეც.
      </p>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          ვერ ჩაიტვირთა: {error.message}
        </div>
      ) : (
        <CategoriesTable categories={(data ?? []) as CategoryRow[]} />
      )}
    </div>
  );
}

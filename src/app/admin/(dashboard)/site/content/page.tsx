import Link from 'next/link';
import { createClient } from '@/lib/supabase-admin/server';
import { SettingsForm } from './SettingsForm';

export default async function SiteContentPage() {
  const supabase = await createClient();
  const [{ data: pages, error: pagesError }, { data: settings, error: settingsError }] = await Promise.all([
    supabase.from('site_pages').select('slug, title, updated_at').order('slug'),
    supabase.from('site_settings').select('key, value'),
  ]);

  const settingsMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">საიტის კონტენტი</h1>
      <p className="mt-1 text-sm text-slate-500">
        ostati.ge-ის საინფორმაციო გვერდები და პარამეტრები — ცვლილება მყისიერად აისახება საიტზე.
      </p>

      {pagesError ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          ვერ ჩაიტვირთა: {pagesError.message}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">გვერდი</th>
                <th className="px-4 py-3 font-medium">სათაური</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(pages ?? []).map((p) => (
                <tr key={p.slug} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">{p.slug}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/site/content/${p.slug}`}
                      className="rounded-lg px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
                    >
                      რედაქტირება
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">პარამეტრები</h2>
        <p className="mt-1 text-xs text-slate-500">Store ლინკები და საკონტაქტო ინფორმაცია.</p>
        {settingsError ? (
          <p className="mt-3 text-sm text-red-600">ვერ ჩაიტვირთა: {settingsError.message}</p>
        ) : (
          <SettingsForm
            playStoreUrl={settingsMap.play_store_url ?? ''}
            appStoreUrl={settingsMap.app_store_url ?? ''}
            contactEmail={settingsMap.contact_email ?? ''}
          />
        )}
      </div>
    </div>
  );
}

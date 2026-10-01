import Link from 'next/link';
import { createClient } from '@/lib/supabase-admin/server';
import { SettingsForm } from './SettingsForm';
import { SITE_TEXTS } from '@/lib/siteTexts';

export default async function SiteContentPage() {
  const supabase = await createClient();
  const [{ data: pages, error: pagesError }, { data: settings, error: settingsError }] = await Promise.all([
    supabase
      .from('site_pages')
      .select('slug, title, kind, is_published, show_in_header, show_in_footer, sort_order, updated_at')
      .order('kind', { ascending: false })
      .order('sort_order')
      .order('slug'),
    supabase.from('site_settings').select('key, value'),
  ]);

  const settingsMap = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value]));

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">საიტის კონტენტი</h1>
          <p className="mt-1 text-sm text-slate-500">
            ostato.app-ის გვერდები და პარამეტრები — ცვლილება მყისიერად აისახება საიტზე.
          </p>
        </div>
        <Link
          href="/admin/site/content/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + ახალი გვერდი
        </Link>
      </div>

      {pagesError ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          ვერ ჩაიტვირთა: {pagesError.message}
        </div>
      ) : (
        (['page', 'system'] as const).map((kind) => {
          const rows = (pages ?? []).filter((p) => p.kind === kind);
          return (
            <section key={kind} className="mt-6">
              <h2 className="text-sm font-semibold text-slate-900">
                {kind === 'page' ? 'გვერდები (იშლება, ემატება)' : 'სისტემური გვერდები (მხოლოდ ტექსტი)'}
              </h2>
              <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">სათაური</th>
                      <th className="px-4 py-3 font-medium">მისამართი</th>
                      {kind === 'page' && <th className="px-4 py-3 font-medium">სტატუსი</th>}
                      {kind === 'page' && <th className="px-4 py-3 font-medium">მენიუ</th>}
                      <th className="px-4 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                          გვერდი არ არის
                        </td>
                      </tr>
                    )}
                    {rows.map((p) => (
                      <tr key={p.slug} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{p.title}</td>
                        <td className="px-4 py-3 text-slate-500">{kind === 'page' ? `/${p.slug}` : p.slug}</td>
                        {kind === 'page' && (
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                p.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {p.is_published ? 'გამოქვეყნებულია' : 'დრაფტი'}
                            </span>
                          </td>
                        )}
                        {kind === 'page' && (
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {[p.show_in_header && 'ჰედერი', p.show_in_footer && 'ფუტერი'].filter(Boolean).join(' · ') || '—'}
                          </td>
                        )}
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
            </section>
          );
        })
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">პარამეტრები</h2>
        <p className="mt-1 text-xs text-slate-500">საიტის ყველა ტექსტი, რომელიც გვერდებში არ შედის: ბმულები, სათაურები, ღილაკები. ცარიელი ველი = ნაგულისხმევი ტექსტი (გარდა იმ ველებისა, რომლებიც განზრახ შეიძლება ცარიელი იყოს).</p>
        {settingsError ? (
          <p className="mt-3 text-sm text-red-600">ვერ ჩაიტვირთა: {settingsError.message}</p>
        ) : (
          <SettingsForm values={Object.fromEntries(SITE_TEXTS.map((t) => [t.key, settingsMap[t.key] ?? t.default]))} />
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { createClient } from '@/lib/supabase-admin/server';
import { formatDateTime } from '@/lib/format';

const PAGE_SIZE = 50;

// ზუსტად 0117-ში ჩაწერილი action-ები
const ACTIONS: Record<string, string> = {
  user_suspend: 'ანგარიშის შეჩერება/აღდგენა',
  verification_review: 'ვერიფიკაციის განხილვა',
  verification_revoke: 'ვერიფიკაციის მოხსნა',
  job_cancel: 'განცხადების გაუქმება',
  dispute_resolve: 'დავის გადაწყვეტა',
  content_remove: 'პროფილის კონტენტის მოხსნა',
  job_photo_remove: 'განცხადების ფოტოს მოხსნა',
  review_hide: 'შეფასების დამალვა/აღდგენა',
  setting_change: 'ლიმიტის ცვლილება',
  app_gate_change: 'ვერსია / ტექნიკური რეჟიმი',
  broadcast_send: 'შეტყობინება ყველასთვის',
  district_add: 'რაიონის დამატება',
  district_toggle: 'რაიონის ჩართვა/გამორთვა',
  category_insert: 'კატეგორიის დამატება',
  category_update: 'კატეგორიის ცვლილება',
  category_delete: 'კატეგორიის წაშლა',
  report_status: 'რეპორტის სტატუსი',
  site_page_insert: 'საიტი: გვერდის დამატება',
  site_page_update: 'საიტი: გვერდის ცვლილება',
  site_page_delete: 'საიტი: გვერდის წაშლა',
  site_setting_change: 'საიტი: პარამეტრის ცვლილება',
  site_block_insert: 'საიტი: სექციის დამატება',
  site_block_update: 'საიტი: სექციის ცვლილება',
  site_block_delete: 'საიტი: სექციის წაშლა',
  site_screenshot_insert: 'საიტი: ეკრანის დამატება',
  site_screenshot_update: 'საიტი: ეკრანის რიგის ცვლილება',
  site_screenshot_delete: 'საიტი: ეკრანის წაშლა',
  chat_view: 'რეპორტირებული საუბრის ნახვა',
};

type Details = Record<string, unknown>;

function summarize(action: string, d: Details): string {
  const reason = typeof d.reason === 'string' && d.reason ? ` — ${d.reason}` : '';
  switch (action) {
    case 'user_suspend': return `${d.suspended ? 'შეჩერდა' : 'აღდგა'}${reason}`;
    case 'verification_review': return `${d.approve ? 'დადასტურდა' : 'უარყოფილია'}${reason}`;
    case 'verification_revoke': return reason.replace(/^ — /, '') || '—';
    case 'job_cancel': return reason.replace(/^ — /, '') || '—';
    case 'dispute_resolve': return d.resolution === 'reopen' ? 'ხელახლა გაიხსნა (ოსტატის სასარგებლოდ)' : 'გაუქმდა (მომხმარებლის სასარგებლოდ)';
    case 'content_remove': return `${{ photo: 'ფოტო', about: 'ტექსტი', certificate: 'სერთიფიკატი', portfolio: 'ნამუშევარი' }[String(d.action)] ?? String(d.action)}${reason}`;
    case 'job_photo_remove': return reason.replace(/^ — /, '') || 'ფოტო მოიხსნა';
    case 'review_hide': return d.hidden ? 'დამალულია' : 'აღდგენილია';
    case 'setting_change': return `ახალი მნიშვნელობა: ${d.value}`;
    case 'app_gate_change': return `${d.maintenance ? 'ტექნიკური რეჟიმი ჩართულია' : 'რეჟიმი გამორთულია'} · მინ. ვერსია: ${d.min_version || '—'}`;
    case 'broadcast_send': return `„${d.title}“ · ${d.audience} · ${d.recipients} მიმღები`;
    case 'district_add': return String(d.region_label ?? '');
    case 'district_toggle': return d.active ? 'ჩაირთო' : 'გამოირთო';
    case 'category_insert':
    case 'category_update': return `${d.name} · ${d.is_active ? 'აქტიური' : 'გამორთული'}${d.featured ? ' · ტოპ' : ''}${d.price_per_sqm ? ' · კვ.მ-ფასი' : ''}`;
    case 'category_delete': return String(d.name ?? '');
    case 'site_page_insert':
    case 'site_page_update':
    case 'site_page_delete': return `${d.title}${d.published === false ? ' · დრაფტი' : ''}`;
    case 'site_screenshot_insert':
    case 'site_screenshot_update':
    case 'site_screenshot_delete': return String(d.path ?? '');
    case 'site_block_insert':
    case 'site_block_update':
    case 'site_block_delete': return `${d.block_key} · ${d.title}`;
    case 'report_status': return `${d.from} → ${d.to}`;
    default: return '';
  }
}

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ action?: string; page?: string }> }) {
  const sp = await searchParams;
  const action = sp.action && ACTIONS[sp.action] ? sp.action : '';
  const page = Math.max(1, Number(sp.page) || 1);
  const supabase = await createClient();

  let q = supabase
    .from('admin_audit_log')
    .select('id, admin_id, action, target_type, target_id, details, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (action) q = q.eq('action', action);
  const { data, count, error } = await q;

  const adminIds = [...new Set((data ?? []).map((r) => r.admin_id).filter(Boolean))] as string[];
  const { data: admins } = adminIds.length
    ? await supabase.from('users').select('id, first_name, last_name, email').in('id', adminIds)
    : { data: [] };
  const adminName = new Map((admins ?? []).map((a) => [a.id, `${a.first_name} ${a.last_name}`.trim() || a.email || a.id.slice(0, 8)]));

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const href = (p: number) => `/admin/app/audit?${new URLSearchParams({ ...(action ? { action } : {}), page: String(p) })}`;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">მოქმედებების ჟურნალი</h1>
      <p className="mt-1 text-sm text-slate-500">
        ადმინების ყველა მოქმედება აპის მართვაში. ჩანაწერები იწერება ავტომატურად და არ იცვლება/იშლება. საიტის კონტენტის
        რედაქტირება ჟურნალშიც ჩანს (ტექსტის გარეშე — მხოლოდ რა გვერდი შეიცვალა).
      </p>

      <form className="mt-4 flex gap-2" action="/admin/app/audit">
        <select name="action" defaultValue={action} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">ყველა მოქმედება</option>
          {Object.entries(ACTIONS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">ფილტრი</button>
      </form>

      {error ? (
        <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">ვერ ჩაიტვირთა: {error.message}</div>
      ) : (data ?? []).length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-400">ჩანაწერი არ არის</div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">დრო</th>
                <th className="px-4 py-3">ადმინი</th>
                <th className="px-4 py-3">მოქმედება</th>
                <th className="px-4 py-3">ობიექტი</th>
                <th className="px-4 py-3">დეტალი</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDateTime(r.created_at)}</td>
                  <td className="px-4 py-3">{r.admin_id ? adminName.get(r.admin_id) ?? r.admin_id.slice(0, 8) : '—'}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{ACTIONS[r.action] ?? r.action}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {r.target_type === 'user' && r.target_id ? (
                      <Link href={`/admin/app/users/${r.target_id}`} className="text-blue-600 hover:underline">
                        მომხმარებელი {r.target_id.slice(0, 8)}
                      </Link>
                    ) : (
                      `${r.target_type}${r.target_id ? ` · ${r.target_id.slice(0, 12)}` : ''}`
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{summarize(r.action, (r.details ?? {}) as Details)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-3 text-sm">
          {page > 1 && <Link href={href(page - 1)} className="text-blue-600 hover:underline">← წინა</Link>}
          <span className="text-slate-500">{page} / {totalPages}</span>
          {page < totalPages && <Link href={href(page + 1)} className="text-blue-600 hover:underline">შემდეგი →</Link>}
        </div>
      )}
    </div>
  );
}

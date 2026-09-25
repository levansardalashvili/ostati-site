'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AREAS = [
  {
    key: 'app',
    href: '/admin/app',
    label: 'აპის მართვა',
    items: [
      { href: '/admin/app/users', label: 'მომხმარებლები' },
      { href: '/admin/app/jobs', label: 'განცხადებები' },
      { href: '/admin/app/categories', label: 'კატეგორიები' },
      { href: '/admin/app/regions', label: 'რეგიონები' },
      { href: '/admin/app/verification', label: 'ვერიფიკაციები' },
      { href: '/admin/app/reports', label: 'რეპორტები' },
      { href: '/admin/app/reviews', label: 'შეფასებები' },
      { href: '/admin/app/disputes', label: 'დავები' },
      { href: '/admin/app/broadcasts', label: 'შეტყობინება' },
      { href: '/admin/app/limits', label: 'ლიმიტები' },
      { href: '/admin/app/gate', label: 'ვერსია / რეჟიმი' },
      { href: '/admin/app/audit', label: 'ჟურნალი' },
    ],
  },
  {
    key: 'site',
    href: '/admin/site',
    label: 'საიტის მართვა',
    items: [
      { href: '/admin/site/content', label: 'გვერდები და პარამეტრები' },
      { href: '/admin/site/blocks', label: 'გვერდის სექციები' },
    ],
  },
];

// მარცხენა მენიუ მხოლოდ იმ არეს ჩამოშლის, სადაც ამჟამად ვართ (`/admin/app/*`
// -> "აპის მართვა"-ს ქვეპუნქტები, `/admin/site/*` -> "საიტის მართვა"-ს) —
// არა ორივეს ერთდროულად. `/admin`-ზე (ზედა დონეზე) არცერთი არეა არ არის
// გახსნილი, ორივე ლეიბლი უბრალო ბმულია თავისი დაწყების წერტილისკენ.
export function Sidebar({ counts }: { counts: Record<string, number> }) {
  const pathname = usePathname();
  const areaTotal = (items: { href: string }[]) => items.reduce((n, i) => n + (counts[i.href] ?? 0), 0);
  const badge = (n: number) =>
    n > 0 ? <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">{n}</span> : null;
  const activeArea = AREAS.find((a) => pathname.startsWith(a.href));

  return (
    <nav className="flex-1 space-y-5 overflow-y-auto p-3">
      <Link
        href="/admin"
        className={`block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
          pathname === '/admin' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
        }`}
      >
        მთავარი
      </Link>

      {AREAS.map((area) => {
        const isActive = activeArea?.key === area.key;
        return (
          <div key={area.key}>
            <Link
              href={area.href}
              className={`block rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition hover:text-slate-600 ${
                isActive ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {area.label}
              {badge(areaTotal(area.items))}
            </Link>
            {isActive && (
              <div className="mt-1 space-y-1">
                {area.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 ${
                      pathname === item.href ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {item.label}
                    {badge(counts[item.href] ?? 0)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

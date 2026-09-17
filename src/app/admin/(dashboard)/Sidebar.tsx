'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AREAS = [
  {
    key: 'app',
    href: '/admin/app',
    label: 'აპის მართვა',
    items: [
      { href: '/admin/app/categories', label: 'კატეგორიები' },
      { href: '/admin/app/verification', label: 'ვერიფიკაციები' },
      { href: '/admin/app/reports', label: 'რეპორტები' },
      { href: '/admin/app/disputes', label: 'დავები' },
    ],
  },
  {
    key: 'site',
    href: '/admin/site',
    label: 'საიტის მართვა',
    items: [{ href: '/admin/site/content', label: 'საიტის კონტენტი' }],
  },
];

// მარცხენა მენიუ მხოლოდ იმ არეს ჩამოშლის, სადაც ამჟამად ვართ (`/admin/app/*`
// -> "აპის მართვა"-ს ქვეპუნქტები, `/admin/site/*` -> "საიტის მართვა"-ს) —
// არა ორივეს ერთდროულად. `/admin`-ზე (ზედა დონეზე) არცერთი არეა არ არის
// გახსნილი, ორივე ლეიბლი უბრალო ბმულია თავისი დაწყების წერტილისკენ.
export function Sidebar() {
  const pathname = usePathname();
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

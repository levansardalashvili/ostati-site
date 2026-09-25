'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

// key={pathname} — გვერდის შეცვლისას <details> თავიდან იქმნება და იხურება (layout-ის ჰედერი ნავიგაციაზე არ იტვირთება ხელახლა)
export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <details key={pathname} className="relative block lg:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
        <Menu size={16} /> მენიუ
      </summary>
      <nav className="absolute right-0 mt-2 flex w-56 flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { LegalDoc } from '@/lib/supabase';

// სამართლებრივი ცენტრის დოკუმენტის ზედა ბილიკი: სამართლებრივი ცენტრი › სათაური
export function LegalBreadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
      <Link href="/legal" className="font-medium text-blue-600 hover:underline">
        სამართლებრივი ცენტრი
      </Link>
      <ChevronRight size={14} />
      <span className="truncate">{title}</span>
    </nav>
  );
}

// „დაკავშირებული დოკუმენტები“ — დანარჩენი დოკუმენტები ცენტრიდან (მიმდინარე გამოტოვებულია)
export function LegalRelated({ docs, currentSlug }: { docs: LegalDoc[]; currentSlug: string }) {
  const others = docs.filter((d) => d.slug !== currentSlug);
  if (others.length === 0) return null;
  return (
    <aside className="mt-16 border-t border-slate-200 pt-8">
      <h2 className="text-base font-semibold text-slate-900">დაკავშირებული დოკუმენტები</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {others.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/${d.slug}`}
              className="group flex h-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              {d.title}
              <ChevronRight size={16} className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href="/legal" className="font-semibold text-blue-600 hover:underline">
          ყველა სამართლებრივი დოკუმენტი →
        </Link>
      </p>
    </aside>
  );
}

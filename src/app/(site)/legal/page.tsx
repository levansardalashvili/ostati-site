import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { getLegalPages } from '@/lib/supabase';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'სამართლებრივი ცენტრი',
  description: 'Ostati-ის პირობები, კონფიდენციალურობის პოლიტიკა, საზოგადოების წესები და უსაფრთხოება ერთ ადგილას.',
};

// ყველა დოკუმენტი, რომელსაც ადმინში „სამართლებრივი ცენტრის დოკუმენტი“ აქვს ჩართული
export default async function LegalCenterPage() {
  const docs = await getLegalPages();
  return (
    <div>
      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <h1 className="break-words text-[1.7rem] font-extrabold tracking-tight text-slate-900 sm:text-4xl">სამართლებრივი ცენტრი</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            პირობები, პოლიტიკები და წესები, რომლებიც განსაზღვრავს, როგორ მუშაობს Ostati და როგორ ვიცავთ მომხმარებლებსა და ოსტატებს.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <ul className="space-y-4">
          {docs.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/${d.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60 sm:p-6"
              >
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-semibold text-slate-900">{d.title}</span>
                  {d.meta_description && <span className="mt-1 block text-sm leading-relaxed text-slate-500">{d.meta_description}</span>}
                </span>
                <ArrowRight size={18} className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-slate-500">
          გაქვთ კითხვა? იხილეთ{' '}
          <Link href="/support" className="font-semibold text-blue-600 hover:underline">
            დახმარება
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

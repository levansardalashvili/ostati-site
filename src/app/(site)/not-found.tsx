import Link from 'next/link';
import { Compass } from 'lucide-react';

// notFound()-ის ყველა გამოძახება (გვერდები, დახმარების სტატიები, /[slug]) სუფთა ქართულ 404-ს აჩვენებს საიტის ჰედერ/ფუტერთან
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Compass size={30} />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-blue-600">404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">გვერდი ვერ მოიძებნა</h1>
      <p className="mt-4 text-slate-600">ეს მისამართი არ არსებობს ან გვერდი გადატანილია. სცადეთ მთავარი გვერდი ან დახმარების ცენტრი.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
          მთავარი გვერდი
        </Link>
        <Link href="/support" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          დახმარება
        </Link>
      </div>
    </div>
  );
}

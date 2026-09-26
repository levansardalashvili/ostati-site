import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'მიმართვის გაგზავნა — დახმარება',
  description: 'მოგვწერეთ — გიპასუხებთ თქვენ მიერ მითითებულ ელფოსტაზე ან ტელეფონზე.',
};

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
          <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/support" className="font-medium text-blue-600 hover:underline">
              დახმარება
            </Link>
            <ChevronRight size={14} />
            <span>მიმართვა</span>
          </nav>
          <h1 className="break-words text-[1.7rem] font-extrabold tracking-tight text-slate-900 sm:text-4xl">მოგვწერეთ</h1>
          <p className="mt-3 text-lg text-slate-600">
            სანამ მიმართავთ, შეამოწმეთ <Link href="/support" className="font-semibold text-blue-600 hover:underline">დახმარების სტატიები</Link> — შესაძლოა პასუხი უკვე იქ არის.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ContactForm />
      </div>
    </div>
  );
}

import { signOut } from '../../(dashboard)/actions';
import { EnrollForm } from './EnrollForm';

export const metadata = { title: 'ორფაქტორიანი დაცვის ჩართვა — Ostati Admin' };

export default function MfaSetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">ორფაქტორიანი დაცვის ჩართვა</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          ადმინის ანგარიში ძალიან მძლავრია (ყველა მომხმარებლის მართვა, შეტყობინებები, წაშლა). ამიტომ პაროლთან ერთად ყოველ შესვლაზე
          დაგჭირდებათ ტელეფონის აპიდან 6-ციფრიანი კოდი.
        </p>
        <EnrollForm />
        <form action={signOut} className="mt-6 text-center">
          <button type="submit" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
            გასვლა
          </button>
        </form>
      </div>
    </div>
  );
}

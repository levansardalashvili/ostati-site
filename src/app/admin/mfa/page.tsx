import { signOut } from '../(dashboard)/actions';
import { ChallengeForm } from './ChallengeForm';

export const metadata = { title: 'ორფაქტორიანი დადასტურება — Ostati Admin' };

export default function MfaChallengePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">დადასტურება</h1>
        <p className="mt-1 text-sm text-slate-500">შეიყვანეთ 6-ციფრიანი კოდი თქვენი Authenticator აპიდან (Google Authenticator, Authy, 1Password...).</p>
        <ChallengeForm />
        <form action={signOut} className="mt-4 text-center">
          <button type="submit" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
            გასვლა
          </button>
        </form>
      </div>
    </div>
  );
}

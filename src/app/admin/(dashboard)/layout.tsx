import { createClient } from '@/lib/supabase-admin/server';
import { signOut } from './actions';
import { Sidebar } from './Sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <span className="text-base font-semibold text-slate-900">Ostati Admin</span>
        </div>
        <Sidebar />
        <div className="border-t border-slate-200 p-3">
          <p className="truncate px-3 text-xs text-slate-500">{user?.email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              გასვლა
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

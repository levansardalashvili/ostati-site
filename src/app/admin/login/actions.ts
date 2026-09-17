'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-admin/server';

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    redirect('/admin/login?error=' + encodeURIComponent('შეავსეთ ორივე ველი'));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect('/admin/login?error=' + encodeURIComponent('ელფოსტა ან პაროლი არასწორია'));
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profile?.role !== 'admin') {
    await supabase.auth.signOut();
    redirect('/admin/login?error=' + encodeURIComponent('ეს ანგარიში არ არის ადმინისტრატორი'));
  }

  redirect('/admin');
}

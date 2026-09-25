'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

export async function saveSetting(key: string, value: number): Promise<ActionResult> {
  if (!Number.isInteger(value)) return { error: 'შეიყვანეთ მთელი რიცხვი' };
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_app_setting', { p_key: key, p_value: value });
  if (error) return { error: error.message.includes('out of range') ? 'მნიშვნელობა დასაშვებ დიაპაზონს სცილდება' : error.message };
  revalidatePath('/admin/app/limits');
  return {};
}

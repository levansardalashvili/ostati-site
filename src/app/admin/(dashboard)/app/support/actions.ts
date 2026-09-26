'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export async function setSupportRequest(id: string, status: string, note: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_support_request', { p_id: id, p_status: status, p_note: note });
  if (error) return { error: error.message };
  revalidatePath('/admin/app/support');
  revalidatePath('/admin', 'layout'); // მენიუს მთვლელი
  return {};
}

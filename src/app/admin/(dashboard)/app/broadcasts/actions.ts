'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type SendResult = { error?: string; sent?: number };

export async function sendBroadcast(title: string, body: string, audience: string): Promise<SendResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_send_broadcast', {
    p_title: title,
    p_body: body,
    p_audience: audience,
  });
  if (error) {
    if (error.message.includes('DUPLICATE_BROADCAST')) return { error: 'იგივე შეტყობინება ბოლო 10 წუთში უკვე გაიგზავნა' };
    return { error: error.message };
  }
  revalidatePath('/admin/app/broadcasts');
  return { sent: data as number };
}

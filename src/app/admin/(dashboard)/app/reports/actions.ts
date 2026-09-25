'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

const STATUSES = ['open', 'reviewing', 'resolved', 'dismissed'] as const;

export async function updateReportStatus(
  id: string,
  status: string,
  kind: 'job' | 'chat' = 'job',
): Promise<ActionResult> {
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { error: 'არასწორი სტატუსი' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from(kind === 'chat' ? 'chat_reports' : 'job_reports').update({ status }).eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/app/reports');
  return {};
}

export async function setUserSuspended(userId: string, suspended: boolean, reason?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_user_suspended', {
    p_user_id: userId,
    p_suspended: suspended,
    p_reason: reason ?? null,
  });
  if (error) return { error: error.message };
  revalidatePath('/admin/app/reports');
  return {};
}

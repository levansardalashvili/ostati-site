'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

export async function cancelJob(jobId: string, reason?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_cancel_job', { p_job_id: jobId, p_reason: reason ?? null });
  if (error) return { error: error.message };
  revalidatePath('/admin/app/jobs');
  return {};
}

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

const STATUSES = ['open', 'reviewing', 'resolved', 'dismissed'] as const;

export async function updateReportStatus(id: string, status: string): Promise<ActionResult> {
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { error: 'არასწორი სტატუსი' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('job_reports').update({ status }).eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/app/reports');
  return {};
}

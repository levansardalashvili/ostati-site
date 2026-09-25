'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

export async function setReviewHidden(id: string, hidden: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_review_hidden', { p_review_id: id, p_hidden: hidden });
  if (error) return { error: error.message };
  revalidatePath('/admin/app/reviews');
  return {};
}

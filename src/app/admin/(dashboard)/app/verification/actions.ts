'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

export async function reviewVerification(
  providerId: string,
  approve: boolean,
  rejectionReason?: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_review_provider_verification', {
    p_provider_id: providerId,
    p_approve: approve,
    p_rejection_reason: rejectionReason ?? null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/app/verification');
  return {};
}

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

export async function setUserSuspended(userId: string, suspended: boolean, reason?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_user_suspended', {
    p_user_id: userId,
    p_suspended: suspended,
    p_reason: reason ?? null,
  });
  if (error) return { error: error.message };
  revalidatePath('/admin/app/users');
  revalidatePath(`/admin/app/users/${userId}`);
  return {};
}

export async function revokeVerification(providerId: string, reason?: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_revoke_verification", { p_provider_id: providerId, p_reason: reason ?? null });
  if (error) return { error: error.message };
  revalidatePath("/admin/app/users");
  revalidatePath(`/admin/app/users/${providerId}`);
  return {};
}

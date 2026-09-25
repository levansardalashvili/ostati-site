'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string; warning?: string };

// Storage path საჯარო URL-იდან / აპის private მარკერიდან
function storageTarget(ref: string): { bucket: string; path: string } | null {
  const pub = ref.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (pub) return { bucket: pub[1], path: decodeURIComponent(pub[2]) };
  if (ref.startsWith('private-media://')) return { bucket: 'private-media', path: ref.slice('private-media://'.length) };
  return null;
}

async function removeFile(ref: string | null): Promise<string | undefined> {
  const target = ref ? storageTarget(ref) : null;
  if (!target) return undefined;
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(target.bucket).remove([target.path]);
  return error || !data || data.length === 0 ? 'ჩანაწერი მოიხსნა, მაგრამ ფაილის წაშლა ვერ მოხერხდა' : undefined;
}

export async function moderateProviderContent(
  providerId: string,
  action: 'photo' | 'about' | 'certificate' | 'portfolio',
  uri: string | null,
  reason: string | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_moderate_provider_content', {
    p_provider_id: providerId,
    p_action: action,
    p_uri: uri,
    p_reason: reason,
  });
  if (error) return { error: error.message };
  const warning = uri ? await removeFile(uri) : undefined;
  revalidatePath(`/admin/app/users/${providerId}`);
  return warning ? { warning } : {};
}

export async function removeJobPhoto(jobId: string, ref: string, userId: string, reason: string | null): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_remove_job_photo', { p_job_id: jobId, p_ref: ref, p_reason: reason });
  if (error) return { error: error.message };
  const warning = await removeFile(ref);
  revalidatePath(`/admin/app/users/${userId}`);
  return warning ? { warning } : {};
}

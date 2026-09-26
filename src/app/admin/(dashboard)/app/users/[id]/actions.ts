'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

function deleteError(message: string): string {
  if (message.includes('ACCOUNT_HAS_ACTIVE_JOBS')) return 'ანგარიშს აქვს მიმდინარე (არჩეული, დაუსრულებელი) სამუშაო — ჯერ უნდა დასრულდეს ან გაუქმდეს';
  if (message.includes('Admin accounts cannot be deleted')) return 'ადმინის ანგარიში არ იშლება';
  if (message.includes('Account not found')) return 'ანგარიში ვერ მოიძებნა (შესაძლოა უკვე წაშლილია)';
  return message;
}

// ანგარიშის სამუდამო წაშლა (მაგ. ვებიდან მოსული მოთხოვნისას). იგივე წესები, რაც მომხმარებლის საკუთარ წაშლაზე: ჯერ RPC-ით
// ვამოწმებთ, რომ წაშლა დაშვებულია, მერე ვშლით ფაილებს (best-effort), ბოლოს — თავად ანგარიშს (გარდაუვალი, ვერ აღდგება).
export async function deleteUserAccount(userId: string, reason: string | null): Promise<ActionResult> {
  const supabase = await createClient();
  const pre = await supabase.rpc('admin_precheck_delete_user', { p_user_id: userId });
  if (pre.error) return { error: deleteError(pre.error.message) };

  let warning: string | undefined;
  // private-media (ჩატი, განცხადების/დასრულების ფოტოები, სელფი) — Edge Function service role-ით, ადმინის JWT-ით
  const fn = await supabase.functions.invoke('delete-account-files', { body: { user_id: userId } });
  if (fn.error) warning = 'ზოგი კერძო ფაილის წაშლა ვერ მოხერხდა';
  // საჯარო bucket-ები — ადმინის storage policy-ებით (0116)
  const folders: [string, string][] = [
    ...(['profile', 'certificate', 'portfolio', 'rating'] as const).map((k): [string, string] => ['user-media', `${k}/${userId}`]),
    ['job-photos', userId],
  ];
  for (const [bucket, folder] of folders) {
    try {
      const { data } = await supabase.storage.from(bucket).list(folder);
      if (data?.length) await supabase.storage.from(bucket).remove(data.map((f) => `${folder}/${f.name}`));
    } catch {
      warning = 'ზოგი ფაილის წაშლა ვერ მოხერხდა';
    }
  }

  const { error } = await supabase.rpc('admin_delete_user', { p_user_id: userId, p_reason: reason });
  if (error) return { error: deleteError(error.message) };
  void warning; // ანგარიში წაიშალა; ფაილების გაფრთხილება ჟურნალში არ იწერება (ფაილებს ვერაფერს მოუხერხებთ ანგარიშის გარეშე)
  revalidatePath('/admin/app/users');
  redirect('/admin/app/users');
}

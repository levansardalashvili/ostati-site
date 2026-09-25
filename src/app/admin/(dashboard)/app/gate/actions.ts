'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

export async function saveGate(minVersion: string, maintenance: boolean, message: string, updateUrl: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('admin_set_app_gate', {
    p_min_version: minVersion,
    p_maintenance: maintenance,
    p_message: message,
    p_update_url: updateUrl,
  });
  if (error) {
    if (error.message.includes('Version must')) return { error: 'ვერსია უნდა იყოს ფორმატით 1.2.3 (ან ცარიელი)' };
    if (error.message.includes('Update URL')) return { error: 'ბმული უნდა იწყებოდეს https://, market:// ან itms-apps://' };
    if (error.message.includes('too long')) return { error: 'ტექსტი მაქსიმუმ 200 სიმბოლოა' };
    return { error: error.message };
  }
  revalidatePath('/admin/app/gate');
  return {};
}

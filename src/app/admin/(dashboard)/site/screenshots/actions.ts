'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string; warning?: string };

const BUCKET = 'site-media';
const TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };
const MAX_BYTES = 5 * 1024 * 1024;

function revalidateSite() {
  revalidatePath('/admin/site/screenshots');
  revalidatePath('/');
}

export async function addScreenshot(formData: FormData): Promise<ActionResult> {
  const file = formData.get('file');
  const alt = String(formData.get('alt') ?? '').trim().slice(0, 120);
  if (!(file instanceof File) || file.size === 0) return { error: 'აირჩიეთ ფოტო' };
  const ext = TYPES[file.type];
  if (!ext) return { error: 'დაშვებულია მხოლოდ PNG, JPG ან WEBP' };
  if (file.size > MAX_BYTES) return { error: 'ფოტო 5 მბ-ზე დიდია' };

  const supabase = await createClient();
  const path = `screens/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (up.error) return { error: up.error.message };

  const { data: last } = await supabase.from('site_screenshots').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const { error } = await supabase.from('site_screenshots').insert({ path, alt, sort_order: (last?.[0]?.sort_order ?? -1) + 1 });
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]); // ჩანაწერის გარეშე ფაილი არ დარჩეს
    return { error: error.message };
  }
  revalidateSite();
  return {};
}

export async function deleteScreenshot(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: row } = await supabase.from('site_screenshots').select('path').eq('id', id).single();
  const { error } = await supabase.from('site_screenshots').delete().eq('id', id);
  if (error) return { error: error.message };
  let warning: string | undefined;
  if (row) {
    const { data, error: rmErr } = await supabase.storage.from(BUCKET).remove([row.path]);
    if (rmErr || !data || data.length === 0) warning = 'ჩანაწერი წაიშალა, მაგრამ ფაილის წაშლა ვერ მოხერხდა';
  }
  revalidateSite();
  return warning ? { warning } : {};
}

export async function moveScreenshot(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_screenshots').select('id, sort_order').order('sort_order', { ascending: true });
  if (error) return { error: error.message };
  const list = data ?? [];
  const i = list.findIndex((s) => s.id === id);
  const j = direction === 'up' ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= list.length) return {};
  const [a, b] = [list[i], list[j]];
  const [r1, r2] = await Promise.all([
    supabase.from('site_screenshots').update({ sort_order: b.sort_order }).eq('id', a.id),
    supabase.from('site_screenshots').update({ sort_order: a.sort_order }).eq('id', b.id),
  ]);
  if (r1.error || r2.error) return { error: (r1.error ?? r2.error)?.message };
  revalidateSite();
  return {};
}

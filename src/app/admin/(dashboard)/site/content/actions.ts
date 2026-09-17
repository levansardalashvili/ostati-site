'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';

export type ActionResult = { error?: string };

// site_pages.slug -> the public route that renders it (see src/app/*/page.tsx).
// 'home' is the one exception (public path is '/', not '/home').
const PUBLIC_PATH: Record<string, string> = {
  home: '/',
  'how-it-works': '/how-it-works',
  privacy: '/privacy',
  terms: '/terms',
};

export async function updatePage(slug: string, formData: FormData): Promise<ActionResult> {
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '');

  if (!title) {
    return { error: 'სათაური სავალდებულოა' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('site_pages').update({ title, content }).eq('slug', slug);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/site/content');
  revalidatePath(`/admin/site/content/${slug}`);
  const publicPath = PUBLIC_PATH[slug];
  if (publicPath) revalidatePath(publicPath);
  return {};
}

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const entries = [
    { key: 'play_store_url', value: String(formData.get('play_store_url') ?? '').trim() },
    { key: 'app_store_url', value: String(formData.get('app_store_url') ?? '').trim() },
    { key: 'contact_email', value: String(formData.get('contact_email') ?? '').trim() },
  ];

  const supabase = await createClient();
  for (const entry of entries) {
    const { error } = await supabase.from('site_settings').update({ value: entry.value }).eq('key', entry.key);
    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath('/admin/site/content');
  // Settings (store links, contact email) render in the shared root
  // layout's footer, so every public page needs revalidating.
  for (const path of Object.values(PUBLIC_PATH)) revalidatePath(path);
  return {};
}

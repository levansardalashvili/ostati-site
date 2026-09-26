'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';
import { ICON_KEYS } from './icons';

export type ActionResult = { error?: string };

// site_blocks.block_key -> the public page(s) that render it, revalidated
// after any write so edits show up immediately instead of waiting for the
// public site's own 60s ISR window.
const PUBLIC_PATHS: Record<string, string[]> = {
  home_features: ['/'],
  how_it_works_steps: ['/', '/how-it-works'],
  how_it_works_provider_steps: ['/how-it-works'],
};

function revalidatePublic(blockKey: string) {
  for (const path of PUBLIC_PATHS[blockKey] ?? []) revalidatePath(path);
}

export async function createBlockItem(blockKey: string, formData: FormData): Promise<ActionResult> {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const iconKey = String(formData.get('icon_key') ?? '');

  if (!title) return { error: 'სათაური სავალდებულოა' };
  if (!ICON_KEYS.includes(iconKey as (typeof ICON_KEYS)[number])) return { error: 'აირჩიეთ აიქონი' };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('site_blocks')
    .select('sort_order')
    .eq('block_key', blockKey)
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const { error } = await supabase
    .from('site_blocks')
    .insert({ block_key: blockKey, sort_order: nextOrder, icon_key: iconKey, title, description });

  if (error) return { error: error.message };

  revalidatePath('/admin/site/blocks');
  revalidatePublic(blockKey);
  return {};
}

export async function updateBlockItem(id: string, blockKey: string, formData: FormData): Promise<ActionResult> {
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const iconKey = String(formData.get('icon_key') ?? '');

  if (!title) return { error: 'სათაური სავალდებულოა' };
  if (!ICON_KEYS.includes(iconKey as (typeof ICON_KEYS)[number])) return { error: 'აირჩიეთ აიქონი' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('site_blocks')
    .update({ title, description, icon_key: iconKey })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/site/blocks');
  revalidatePublic(blockKey);
  return {};
}

export async function deleteBlockItem(id: string, blockKey: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('site_blocks').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/site/blocks');
  revalidatePublic(blockKey);
  return {};
}

export async function moveBlockItem(blockKey: string, id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: items, error: fetchError } = await supabase
    .from('site_blocks')
    .select('id, sort_order')
    .eq('block_key', blockKey)
    .order('sort_order', { ascending: true });

  if (fetchError) return { error: fetchError.message };

  const list = items ?? [];
  const index = list.findIndex((i) => i.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= list.length) return {};

  const a = list[index];
  const b = list[swapIndex];

  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from('site_blocks').update({ sort_order: b.sort_order }).eq('id', a.id),
    supabase.from('site_blocks').update({ sort_order: a.sort_order }).eq('id', b.id),
  ]);

  if (e1 || e2) return { error: (e1 ?? e2)?.message };

  revalidatePath('/admin/site/blocks');
  revalidatePublic(blockKey);
  return {};
}

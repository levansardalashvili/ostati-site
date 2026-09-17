'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-admin/server';
import { ICON_KEYS } from './icons';

export type ActionResult = { error?: string };

const ID_RE = /^[a-z][a-z0-9_]*$/;

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const id = String(formData.get('id') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const iconKey = String(formData.get('icon_key') ?? '');
  const sortOrder = Number(formData.get('sort_order') ?? 0);

  if (!ID_RE.test(id)) {
    return { error: 'ID უნდა იყოს ლათინური პატარა ასოები/ციფრები/_ (მაგ: door_locks)' };
  }
  if (!name) {
    return { error: 'სახელი სავალდებულოა' };
  }
  if (!ICON_KEYS.includes(iconKey as (typeof ICON_KEYS)[number])) {
    return { error: 'აირჩიეთ აიქონი' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('categories').insert({
    id,
    name,
    icon_key: iconKey,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/app/categories');
  return {};
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim();
  const iconKey = String(formData.get('icon_key') ?? '');
  const sortOrder = Number(formData.get('sort_order') ?? 0);

  if (!name) {
    return { error: 'სახელი სავალდებულოა' };
  }
  if (!ICON_KEYS.includes(iconKey as (typeof ICON_KEYS)[number])) {
    return { error: 'აირჩიეთ აიქონი' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .update({
      name,
      icon_key: iconKey,
      sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/app/categories');
  return {};
}

export async function toggleCategoryField(
  id: string,
  field: 'is_active' | 'featured',
  value: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .update({ [field]: value })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/app/categories');
  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/app/categories');
  return {};
}

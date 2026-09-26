'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-admin/server';
import { ICON_KEYS } from '../blocks/icons';

export type ActionResult = { error?: string };

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// საჯარო საიტი იმავე Next აპშია — ცვლილება მყისიერად ჩანს
function revalidateHelp() {
  revalidatePath('/support', 'layout');
  revalidatePath('/admin/site/help');
}

function friendly(message: string): string {
  if (message.includes('help_articles_category_id_slug_key')) return 'ამ კატეგორიაში ასეთი მისამართის სტატია უკვე არსებობს';
  if (message.includes('help_categories_pkey')) return 'ასეთი მისამართის კატეგორია უკვე არსებობს';
  if (message.includes('help_categories_id_check')) return 'მისამართი არასწორია ან დაკავებულია (პატარა ლათინური ასოები, ციფრები, დეფისი; „contact“ აკრძალულია)';
  if (message.includes('help_articles_slug_check')) return 'მისამართი: პატარა ლათინური ასოები, ციფრები და დეფისი';
  if (message.includes('violates foreign key') && message.includes('help_articles')) return 'კატეგორიაში სტატიებია — ჯერ წაშალეთ ან გადაიტანეთ ისინი';
  return message;
}

// ---- კატეგორიები ----
function readCategory(fd: FormData) {
  const icon = String(fd.get('icon_key') ?? 'FileText');
  return {
    title: String(fd.get('title') ?? '').trim(),
    description: String(fd.get('description') ?? '').trim().slice(0, 200),
    icon_key: (ICON_KEYS as readonly string[]).includes(icon) ? icon : 'FileText',
    is_published: fd.get('is_published') === 'on',
  };
}

export async function createCategory(fd: FormData): Promise<ActionResult> {
  const id = String(fd.get('id') ?? '').trim();
  const f = readCategory(fd);
  if (!SLUG_RE.test(id) || id.length > 40) return { error: 'მისამართი: პატარა ლათინური ასოები, ციფრები და დეფისი' };
  if (!f.title) return { error: 'სათაური სავალდებულოა' };
  const supabase = await createClient();
  const { data: last } = await supabase.from('help_categories').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  const { error } = await supabase.from('help_categories').insert({ id, ...f, sort_order: (last?.[0]?.sort_order ?? -1) + 1 });
  if (error) return { error: friendly(error.message) };
  revalidateHelp();
  return {};
}

export async function updateCategory(id: string, fd: FormData): Promise<ActionResult> {
  const f = readCategory(fd);
  if (!f.title) return { error: 'სათაური სავალდებულოა' };
  const supabase = await createClient();
  const { error } = await supabase.from('help_categories').update(f).eq('id', id);
  if (error) return { error: friendly(error.message) };
  revalidateHelp();
  return {};
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('help_categories').delete().eq('id', id);
  if (error) return { error: friendly(error.message) };
  revalidateHelp();
  return {};
}

export async function moveCategory(id: string, direction: 'up' | 'down'): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('help_categories').select('id, sort_order').order('sort_order', { ascending: true });
  if (error) return { error: error.message };
  const list = data ?? [];
  const i = list.findIndex((c) => c.id === id);
  const j = direction === 'up' ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= list.length) return {};
  // ტოლი sort_order-ის შემთხვევაში swap უშედეგო იქნებოდა — ვანომრავთ თავიდან
  const order = list.map((c) => c.id);
  [order[i], order[j]] = [order[j], order[i]];
  const results = await Promise.all(order.map((cid, idx) => supabase.from('help_categories').update({ sort_order: idx }).eq('id', cid)));
  const failed = results.find((r) => r.error);
  if (failed?.error) return { error: failed.error.message };
  revalidateHelp();
  return {};
}

// ---- სტატიები ----
function readArticle(fd: FormData) {
  return {
    category_id: String(fd.get('category_id') ?? ''),
    title: String(fd.get('title') ?? '').trim(),
    summary: String(fd.get('summary') ?? '').trim().slice(0, 200),
    content: String(fd.get('content') ?? ''),
    sort_order: Number.parseInt(String(fd.get('sort_order') ?? '0'), 10) || 0,
    is_published: fd.get('is_published') === 'on',
  };
}

export async function createArticle(fd: FormData): Promise<ActionResult> {
  const slug = String(fd.get('slug') ?? '').trim();
  const f = readArticle(fd);
  if (!SLUG_RE.test(slug) || slug.length > 60) return { error: 'მისამართი: პატარა ლათინური ასოები, ციფრები და დეფისი' };
  if (!f.title || !f.category_id) return { error: 'სათაური და კატეგორია სავალდებულოა' };
  const supabase = await createClient();
  const { data, error } = await supabase.from('help_articles').insert({ slug, ...f }).select('id').single();
  if (error) return { error: friendly(error.message) };
  revalidateHelp();
  redirect(`/admin/site/help/${data.id}`);
}

export async function updateArticle(id: string, fd: FormData): Promise<ActionResult> {
  const f = readArticle(fd);
  if (!f.title || !f.category_id) return { error: 'სათაური და კატეგორია სავალდებულოა' };
  const supabase = await createClient();
  const { error } = await supabase.from('help_articles').update(f).eq('id', id);
  if (error) return { error: friendly(error.message) };
  revalidateHelp();
  revalidatePath(`/admin/site/help/${id}`);
  return {};
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('help_articles').delete().eq('id', id);
  if (error) return { error: friendly(error.message) };
  revalidateHelp();
  redirect('/admin/site/help');
}

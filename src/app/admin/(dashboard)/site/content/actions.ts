'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-admin/server';
import { SITE_TEXT_KEYS } from '@/lib/siteTexts';

export type ActionResult = { error?: string };

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// საჯარო საიტი იმავე Next აპშია — ადმინიდან შენახვისას მთელი (site) ხე მყისიერად განახლდება (60-წამიანი ქეშის ლოდინის გარეშე)
function revalidateSite() {
  revalidatePath('/', 'layout');
  revalidatePath('/admin/site/content');
}

function readFields(formData: FormData) {
  return {
    title: String(formData.get('title') ?? '').trim(),
    content: String(formData.get('content') ?? ''),
    meta_description: String(formData.get('meta_description') ?? '').trim().slice(0, 200),
    nav_label: String(formData.get('nav_label') ?? '').trim().slice(0, 30),
    is_published: formData.get('is_published') === 'on',
    show_in_header: formData.get('show_in_header') === 'on',
    show_in_footer: formData.get('show_in_footer') === 'on',
    sort_order: Number.parseInt(String(formData.get('sort_order') ?? '0'), 10) || 0,
  };
}

function friendly(message: string): string {
  if (message.includes('site_pages_pkey') || message.includes('duplicate key')) return 'ასეთი მისამართის გვერდი უკვე არსებობს';
  if (message.includes('site_pages_slug_check')) return 'მისამართი დაკავებულია ან არასწორია (მხოლოდ პატარა ლათინური ასოები, ციფრები და დეფისი)';
  if (message.includes('SYSTEM_PAGE_PROTECTED')) return 'სისტემური გვერდი არ იშლება';
  return message;
}

export async function createPage(formData: FormData): Promise<ActionResult> {
  const slug = String(formData.get('slug') ?? '').trim();
  const f = readFields(formData);
  if (!SLUG_RE.test(slug) || slug.length > 60) return { error: 'მისამართი: პატარა ლათინური ასოები, ციფრები და დეფისი (მაგ. about-us)' };
  if (!f.title) return { error: 'სათაური სავალდებულოა' };

  const supabase = await createClient();
  const { error } = await supabase.from('site_pages').insert({ slug, kind: 'page', ...f });
  if (error) return { error: friendly(error.message) };
  revalidateSite();
  redirect(`/admin/site/content/${slug}`);
}

export async function updatePage(slug: string, formData: FormData): Promise<ActionResult> {
  const f = readFields(formData);
  if (!f.title) return { error: 'სათაური სავალდებულოა' };

  const supabase = await createClient();
  const { data: existing } = await supabase.from('site_pages').select('kind').eq('slug', slug).single();
  if (!existing) return { error: 'გვერდი ვერ მოიძებნა' };

  // სისტემურ გვერდზე მხოლოდ სათაური და ტექსტი იცვლება (განლაგება/გამოქვეყნება კოდის შაბლონს ეკუთვნის)
  const patch = existing.kind === 'system' ? { title: f.title, content: f.content } : f;
  const { error } = await supabase.from('site_pages').update(patch).eq('slug', slug);
  if (error) return { error: friendly(error.message) };
  revalidateSite();
  revalidatePath(`/admin/site/content/${slug}`);
  return {};
}

export async function deletePage(slug: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('site_pages').delete().eq('slug', slug).eq('kind', 'page');
  if (error) return { error: friendly(error.message) };
  revalidateSite();
  redirect('/admin/site/content');
}

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const rows = SITE_TEXT_KEYS.map((key) => ({ key, value: String(formData.get(key) ?? '').trim() }));
  const supabase = await createClient();
  const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
  if (error) return { error: error.message };
  revalidateSite();
  return {};
}

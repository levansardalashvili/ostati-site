import { createClient } from '@supabase/supabase-js';

// This site has no auth at all — every visitor is anonymous, and every
// query goes through the `to anon` public-read RLS policies on
// site_pages/site_settings (see ostati-app's 0071_site_content.sql).
// A fresh client per call is fine here (no session/cookies to manage).
export function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export type SitePage = {
  slug: string;
  title: string;
  content: string;
  kind: 'system' | 'page';
  meta_description: string;
};

export async function getPage(slug: string): Promise<SitePage | null> {
  const { data } = await supabase()
    .from('site_pages')
    .select('slug, title, content, kind, meta_description')
    .eq('slug', slug)
    .single();
  return data;
}

export type NavPage = { slug: string; title: string; nav_label: string; show_in_header: boolean; show_in_footer: boolean };

// გამოქვეყნებული თავისუფალი გვერდები — ჰედერის/ფუტერის მენიუსა და sitemap-ისთვის (RLS დრაფტს anon-ს არ აძლევს)
export async function getNavPages(): Promise<NavPage[]> {
  const { data } = await supabase()
    .from('site_pages')
    .select('slug, title, nav_label, show_in_header, show_in_footer')
    .eq('kind', 'page')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });
  return data ?? [];
}

export async function getSettings(): Promise<Record<string, string>> {
  const { data } = await supabase().from('site_settings').select('key, value');
  return Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));
}

export type SiteCategory = {
  id: string;
  name: string;
  icon_key: string;
};

// Same `categories` table the mobile app reads (ostati-app's
// src/services/categoryService.ts) — the admin panel's "კატეგორიები"
// section is the only writer (0070/0072). Only active ones, in the same
// order the app shows them.
export async function getCategories(): Promise<SiteCategory[]> {
  const { data } = await supabase()
    .from('categories')
    .select('id, name, icon_key')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export type SiteBlockItem = {
  id: string;
  icon_key: string;
  title: string;
  description: string;
};

// Ordered-list content sections that don't fit site_pages' single
// title+body shape (0074) — e.g. block_key='home_features' or
// 'how_it_works_steps'. Admin-editable from /admin/site/blocks.
export async function getBlocks(blockKey: string): Promise<SiteBlockItem[]> {
  const { data } = await supabase()
    .from('site_blocks')
    .select('id, icon_key, title, description')
    .eq('block_key', blockKey)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export type SiteScreenshot = { id: string; url: string; alt: string };

export function screenshotUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-media/${path}`;
}

// აპის რეალური ეკრანები (ადმინიდან იმართება) — ცარიელი სია = საიტი დემო ეკრანებზე გადადის
export async function getScreenshots(): Promise<SiteScreenshot[]> {
  const { data } = await supabase().from('site_screenshots').select('id, path, alt').order('sort_order', { ascending: true });
  return (data ?? []).map((s) => ({ id: s.id, alt: s.alt, url: screenshotUrl(s.path) }));
}

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
};

export async function getPage(slug: string): Promise<SitePage | null> {
  const { data } = await supabase().from('site_pages').select('slug, title, content').eq('slug', slug).single();
  return data;
}

export async function getSettings(): Promise<Record<string, string>> {
  const { data } = await supabase().from('site_settings').select('key, value');
  return Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));
}

import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client — anon key only, RLS-enforced. Used from
// Client Components (login form). Never import this in a Server Component.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

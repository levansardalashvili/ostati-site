import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_OPTIONS } from './cookieOptions';

// Server-side Supabase client — anon key + the caller's own cookie-backed
// session, so every query still goes through RLS as that specific admin
// user (never a service_role bypass). Use from Server Components, Server
// Actions, and Route Handlers.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: ADMIN_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component that can't set cookies —
            // middleware already refreshes the session on every request,
            // so this is safe to ignore.
          }
        },
      },
    },
  );
}

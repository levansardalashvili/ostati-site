import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE_OPTIONS } from './cookieOptions';

// Runs on every request (see src/proxy.ts). Only touches `/admin/*` paths —
// the public site (/, /how-it-works, /privacy, /terms) is never gated and
// never even talks to Supabase here, since it has no auth of its own.
// For /admin/*: (1) refreshes the Supabase session cookie, (2) gates every
// admin route except /admin/login behind "signed in AND users.role =
// 'admin'" — a Customer/Provider account with valid Supabase credentials
// must NOT be able to reach any admin page, even though it authenticates
// successfully against the same Supabase project.
export async function updateSession(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: ADMIN_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  if (user && !isLoginPage) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'not_admin');
      return NextResponse.redirect(url);
    }

    // ორფაქტორიანი დადასტურება (TOTP): პაროლი (aal1) საკმარისი არ არის.
    //  - დადასტურებული ფაქტორი აქვს → /admin/mfa (კოდის შეყვანა)
    //  - ფაქტორი არ აქვს → /admin/mfa/setup (ჩართვა). ეს აიძულებს ჩართვას; ბაზაც (is_admin, 0137) ფაქტორის რეგისტრაციის შემდეგ aal1-ს აღარ უშვებს.
    //  - aal2 → ყველაფერი ღიაა (setup-იც, ახალი მოწყობილობის დასამატებლად); მხოლოდ კოდის გვერდი აღარ სჭირდება
    const path = request.nextUrl.pathname;
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const hasFactor = (user.factors ?? []).some((f) => f.status === 'verified');
    let to: string | null = null;
    if (aal?.currentLevel !== 'aal2') {
      const need = hasFactor ? '/admin/mfa' : '/admin/mfa/setup';
      if (path !== need) to = need;
    } else if (path === '/admin/mfa') {
      to = '/admin';
    }
    if (to) {
      const url = request.nextUrl.clone();
      url.pathname = to;
      url.search = '';
      const redirect = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c));
      return redirect;
    }
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

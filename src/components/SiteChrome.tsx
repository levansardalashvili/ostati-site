import Link from 'next/link';
import { Mail, Smartphone, Wrench } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { safeEmail, safeHttpUrl } from '@/lib/safeUrl';

type NavItem = { href: string; label: string };
type NavPage = { slug: string; title: string; nav_label?: string; show_in_header: boolean; show_in_footer: boolean };

// კოდის მარშრუტები (სერვისები — ბაზის კატეგორიებიდან, როგორ მუშაობს — სისტემური გვერდი); დანარჩენი მენიუ ადმინიდან იმართება
const FIXED_NAV: NavItem[] = [
  { href: '/services', label: 'სერვისები' },
  { href: '/how-it-works', label: 'როგორ მუშაობს' },
  { href: '/legal', label: 'პოლიტიკები' },
  { href: '/support', label: 'დახმარება' },
];

const toItem = (p: NavPage): NavItem => ({ href: `/${p.slug}`, label: p.nav_label || p.title });
const headerNav = (pages: NavPage[]) => [...FIXED_NAV, ...pages.filter((p) => p.show_in_header).map(toItem)];
const footerNav = (pages: NavPage[]) => [...FIXED_NAV, ...pages.filter((p) => p.show_in_footer).map(toItem)];

export function Logo({ className = '', light = false, name = 'Ostato' }: { className?: string; light?: boolean; name?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm shadow-blue-600/30">
        <Wrench size={18} strokeWidth={2.3} />
      </span>
      <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>{name}</span>
    </Link>
  );
}

export function SiteHeader({ pages = [], siteName, ctaLabel = 'გადმოწერე' }: { pages?: NavPage[]; siteName?: string; ctaLabel?: string }) {
  const items = headerNav(pages);
  const mobileItems = [...new Map([...items, ...footerNav(pages)].map((i) => [i.href, i])).values()];
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Logo name={siteName} />
        <nav className="hidden ml-6 items-center gap-4 whitespace-nowrap xl:flex 2xl:gap-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#download"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {ctaLabel}
          </Link>
        </nav>
        <MobileMenu items={mobileItems} />
      </div>
    </header>
  );
}

// href-ის გარეშე (store ბმული ჯერ არ არსებობს) ბეჯი მაინც ჩანს, უბრალოდ
// "მალე"-ს სტატუსით — არა უხილავი placeholder-ის ნაცვლად, დიზაინი
// შესაფასებელი დარჩეს რეალური ბმულის დამატებამდეც. onDark — მუქ ფონზე.
export function StoreBadge({ href: rawHref, kind, onDark = false }: { href?: string; kind: 'play' | 'apple'; onDark?: boolean }) {
  const href = safeHttpUrl(rawHref); // მხოლოდ http(s) — ადმინის პარამეტრიდან javascript: ბმული ვერ მოხვდება
  const label = kind === 'play' ? 'Google Play' : 'App Store';

  const content = (
    <>
      <Smartphone size={22} />
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wide opacity-70">{href ? 'გადმოწერე' : 'მალე'}</span>
        <span className="block text-sm font-semibold">{label}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <span
        className={`flex cursor-default items-center gap-3 rounded-xl border border-dashed px-5 py-3 ${
          onDark ? 'border-white/30 text-white/60' : 'border-slate-300 bg-white/60 text-slate-400'
        }`}
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-xl px-5 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        onDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
      }`}
    >
      {content}
    </a>
  );
}

export function SiteFooter({
  playStoreUrl,
  appStoreUrl,
  contactEmail,
  tagline,
  pages = [],
  siteName = 'Ostato',
  copyright = 'ყველა უფლება დაცულია.',
}: {
  playStoreUrl?: string;
  appStoreUrl?: string;
  contactEmail?: string;
  tagline?: string;
  pages?: NavPage[];
  siteName?: string;
  copyright?: string;
}) {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo light name={siteName} />
            {tagline && <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">{tagline}</p>}
            {safeEmail(contactEmail) && (
              <a
                href={`mailto:${safeEmail(contactEmail)}`}
                className="mt-5 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                <Mail size={15} /> {contactEmail}
              </a>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">გვერდები</p>
            <div className="mt-4 grid grid-cols-1 gap-2.5">
              {footerNav(pages).map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">გადმოწერე</p>
            <div className="mt-4 flex flex-col items-start gap-3">
              <StoreBadge href={playStoreUrl} kind="play" onDark />
              <StoreBadge href={appStoreUrl} kind="apple" onDark />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {siteName}. {copyright}
        </div>
      </div>
    </footer>
  );
}

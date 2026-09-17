import Link from 'next/link';
import { Smartphone, Wrench } from 'lucide-react';

const NAV = [
  { href: '/services', label: 'სერვისები' },
  { href: '/how-it-works', label: 'როგორ მუშაობს' },
  { href: '/privacy', label: 'კონფიდენციალურობა' },
  { href: '/terms', label: 'წესები' },
];

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
        <Wrench size={17} strokeWidth={2.3} />
      </span>
      <span className="text-lg font-bold text-slate-900">Ostati</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <nav className="hidden gap-6 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/how-it-works"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:hidden"
        >
          როგორ მუშაობს
        </Link>
      </div>
    </header>
  );
}

// href-ის გარეშე (store ბმული ჯერ არ არსებობს) ბეჯი მაინც ჩანს, უბრალოდ
// "მალე"-ს სტატუსით — არა უხილავი placeholder-ის ნაცვლად, დიზაინი
// შესაფასებელი დარჩეს რეალური ბმულის დამატებამდეც.
export function StoreBadge({ href, kind }: { href?: string; kind: 'play' | 'apple' }) {
  const label = kind === 'play' ? 'Google Play-ზე' : 'App Store-ზე';

  const content = (
    <>
      <Smartphone size={20} />
      <span className="text-left leading-tight">
        <span className="block text-[10px] text-slate-300">{href ? 'გადმოწერე' : 'მალე'}</span>
        <span className="block text-sm font-semibold">{label}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <span className="flex cursor-default items-center gap-2.5 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-slate-400">
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      className="flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-2.5 text-white transition hover:bg-slate-800"
    >
      {content}
    </a>
  );
}

export function SiteFooter({
  playStoreUrl,
  appStoreUrl,
  contactEmail,
}: {
  playStoreUrl?: string;
  appStoreUrl?: string;
  contactEmail?: string;
}) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Ostati აკავშირებს მომხმარებლებს სანდო, ადგილობრივ ოსტატებთან — სანტექნიკოსი,
              ელექტრიკოსი და სხვა.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">გვერდები</p>
              <div className="mt-3 flex flex-col gap-2">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-slate-600 transition hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">გადმოწერე</p>
              <div className="mt-3 flex flex-col gap-2">
                <StoreBadge href={playStoreUrl} kind="play" />
                <StoreBadge href={appStoreUrl} kind="apple" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} Ostati</span>
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="hover:text-slate-600">
              {contactEmail}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

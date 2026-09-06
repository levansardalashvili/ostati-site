import Link from 'next/link';

const NAV = [
  { href: '/', label: 'მთავარი' },
  { href: '/how-it-works', label: 'როგორ მუშაობს' },
  { href: '/privacy', label: 'კონფიდენციალურობა' },
  { href: '/terms', label: 'წესები' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Ostati
        </Link>
        <nav className="flex gap-5">
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
      </div>
    </header>
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
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-4">
          {playStoreUrl && (
            <a
              href={playStoreUrl}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Google Play-ზე
            </a>
          )}
          {appStoreUrl && (
            <a
              href={appStoreUrl}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              App Store-ზე
            </a>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
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

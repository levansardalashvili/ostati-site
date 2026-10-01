import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "../globals.css";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getNavPages, getSettings } from "@/lib/supabase";
import { text } from "@/lib/siteTexts";

// ქართული ასოებით სრულყოფილი შრიფტი (Geist-ს ქართული არ აქვს — ბრაუზერი შემთხვევით fallback-ს იღებდა)
const georgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  subsets: ["georgian", "latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const name = text(settings, "site_name");
  return {
    metadataBase: new URL("https://ostato.app"),
    title: { default: name, template: `%s | ${name}` },
    description: text(settings, "site_description"),
    openGraph: { siteName: name, locale: "ka_GE", type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, pages] = await Promise.all([getSettings(), getNavPages()]);

  return (
    <html
      lang="ka"
      className={`${georgian.variable} h-full antialiased scroll-smooth`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <SiteHeader pages={pages} siteName={text(settings, "site_name")} ctaLabel={text(settings, "header_cta")} />
        <main className="flex-1">{children}</main>
        <SiteFooter
          playStoreUrl={settings.play_store_url}
          appStoreUrl={settings.app_store_url}
          contactEmail={settings.contact_email}
          tagline={text(settings, "footer_tagline")}
          siteName={text(settings, "site_name")}
          copyright={text(settings, "copyright_text")}
          pages={pages}
        />
      </body>
    </html>
  );
}

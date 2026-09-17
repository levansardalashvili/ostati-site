import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { getSettings } from "@/lib/supabase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ostati.ge"),
  title: {
    default: "Ostati — იპოვე სანდო ოსტატი",
    template: "%s | Ostati",
  },
  description: "Ostati აკავშირებს მომხმარებლებს ადგილობრივ ოსტატებთან.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html
      lang="ka"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter
          playStoreUrl={settings.play_store_url}
          appStoreUrl={settings.app_store_url}
          contactEmail={settings.contact_email}
        />
      </body>
    </html>
  );
}

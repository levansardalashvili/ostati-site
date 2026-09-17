import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

// A separate root layout (Next.js "multiple root layouts" pattern) — the
// admin panel is a completely different surface from the public site
// (src/app/(site)/layout.tsx) and must NOT inherit its header/footer.
// Both layouts independently define <html>/<body>; Next.js picks whichever
// one applies based on the matched route.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ostati Admin",
  description: "Ostati-ის ადმინისტრირების პანელი",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

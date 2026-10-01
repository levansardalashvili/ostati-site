import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "../globals.css";

// A separate root layout (Next.js "multiple root layouts" pattern) — the
// admin panel is a completely different surface from the public site
// (src/app/(site)/layout.tsx) and must NOT inherit its header/footer.
// Both layouts independently define <html>/<body>; Next.js picks whichever
// one applies based on the matched route.

const georgian = Noto_Sans_Georgian({
  variable: "--font-georgian",
  subsets: ["georgian", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ostato Admin",
  description: "Ostato-ის ადმინისტრირების პანელი",
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={`${georgian.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

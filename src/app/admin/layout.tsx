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
  title: "Ostati Admin",
  description: "Ostati-ის ადმინისტრირების პანელი",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={`${georgian.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

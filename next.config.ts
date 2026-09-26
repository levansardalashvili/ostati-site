import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").host;
  } catch {
    return "";
  }
})();

// Content-Security-Policy (მხოლოდ production-ში: dev-ს HMR/eval სჭირდება).
// script-src 'unsafe-inline' — Next-ის საკუთარი inline bootstrap სკრიპტები; ისევ იბლოკება: გარე დომენის სკრიპტი,
// <object>/<embed>, <base> ჩანაცვლება, სხვაგან გაგზავნილი ფორმა და ჩაშენება სხვა საიტში (clickjacking).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabaseHost ? `https://${supabaseHost}` : ""}`.trim(),
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseHost ? `https://${supabaseHost} wss://${supabaseHost}` : ""}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isProd
    ? [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        { key: "Content-Security-Policy", value: csp },
      ]
    : []),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"], // dev: ტესტისთვის მეორე origin-ზე (ცალკე cookie-jar) გახსნა
  poweredByHeader: false, // X-Powered-By: Next.js — ტექნოლოგიის გამჟღავნება არასაჭიროა
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // ადმინის გვერდები არასდროს ქეშირდება (არც ბრაუზერში, არც შუალედურ სერვერზე) და არ ინდექსირდება
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;

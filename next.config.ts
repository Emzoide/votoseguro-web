import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://apiplataformaelectoral8.jne.gob.pe https://mpesije.jne.gob.pe https://sroppublico.jne.gob.pe https://ixmvqstgbobhqbwxjgjh.supabase.co",
      "font-src 'self'",
      "connect-src 'self' https://apiplataformaelectoral8.jne.gob.pe https://mpesije.jne.gob.pe",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apiplataformaelectoral8.jne.gob.pe",
      },
      {
        protocol: "https",
        hostname: "mpesije.jne.gob.pe",
      },
      {
        protocol: "https",
        hostname: "sroppublico.jne.gob.pe",
      },
      {
        protocol: "https",
        hostname: "ixmvqstgbobhqbwxjgjh.supabase.co",
      },
    ],
  },
};

export default nextConfig;

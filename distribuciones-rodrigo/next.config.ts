import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportación estática: el sitio se puede servir desde cualquier alojamiento
  // (Vercel, Netlify, Cloudflare Pages o un FTP clásico) sin servidor Node.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;

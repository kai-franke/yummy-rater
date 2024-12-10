/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Protokoll festlegen, entweder 'https' oder 'http'
        hostname: '**',    // '**' erlaubt alle Domains
      },
    ],
  },
};

export default nextConfig;

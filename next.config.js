/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    domains: ['qiesdddadzgdmoaupfxv.supabase.co'],
  },
  // Enable detailed error stack traces in production
  productionBrowserSourceMaps: true,
}

module.exports = nextConfig 
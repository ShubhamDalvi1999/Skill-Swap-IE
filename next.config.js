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
  // Ignore build errors for missing environment variables in production
  onError: (err) => {
    if (process.env.NODE_ENV === 'production' && 
        (err.message.includes('Supabase') || 
         err.message.includes('environment variable'))) {
      console.warn('Ignoring Supabase client error during build:', err.message);
      return;
    }
    throw err;
  },
}

module.exports = nextConfig 
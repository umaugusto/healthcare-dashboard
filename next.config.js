/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'bgivemisrbkdtmbxojlu.supabase.co',
      'avatars.githubusercontent.com',
      'images.unsplash.com'
    ],
  },
  // Redirect root to dashboard
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: true,
  
  // Optimize bundle
  webpack: (config, { dev, isServer }) => {
    // Reduce bundle size in production
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/components/ui': '@/components/ui',
        '@/lib': '@/lib',
      }
    }
    return config
  },
}

module.exports = nextConfig
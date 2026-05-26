import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@sasmaster/ui', '@sasmaster/tokens', '@sasmaster/types'],
  experimental: {
    optimizePackageImports: ['@sasmaster/ui'],
  },
}

export default nextConfig

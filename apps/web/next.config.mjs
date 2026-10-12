/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Workspace packages ship TypeScript source.
  transpilePackages: ['@rwm/tokens', '@rwm/icons', '@rwm/shared'],
};

export default nextConfig;

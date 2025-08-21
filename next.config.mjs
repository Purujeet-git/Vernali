/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '1mizsjmuh3tmnj18.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;

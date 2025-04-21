/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      // Supabase Storage 추가
      {
        protocol: 'https',
        hostname: 'opsegxznqckwpvhpotod.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // /image 경로를 /images 경로로 리다이렉트
  async redirects() {
    return [
      {
        source: '/image/:id',
        destination: '/images/:id',
        permanent: true,
      },
      {
        source: '/image',
        destination: '/images',
        permanent: true,
      }
    ]
  },
}

module.exports = nextConfig 
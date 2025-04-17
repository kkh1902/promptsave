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
      // TODO: 추후 Supabase Storage 사용 시 public URL의 호스트명 추가 필요
      // 예: 
      // {
      //   protocol: 'https',
      //   hostname: 'YOUR_PROJECT_ID.supabase.co',
      //   port: '',
      //   pathname: '/storage/v1/object/public/**',
      // },
    ],
  },
}

module.exports = nextConfig 
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Author {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string | null;
  followers_count?: number | null;
  // Add other necessary author fields
}

interface Post {
  likes_count?: number | null;
  // Add other necessary post fields that might be relevant (e.g., author's post count)
}

interface AuthorProfileCardProps {
  author: Author | null;
  post: Post | null; // Pass post data if needed, e.g., for like count
}

export function AuthorProfileCard({ author, post }: AuthorProfileCardProps) {
  const formattedDate = author?.created_at
    ? format(new Date(author.created_at), 'MMM d, yyyy')
    : 'N/A';

  // TODO: Replace placeholder post count with actual data if available
  const authorPostCount = 1; // Placeholder

  return (
    <Card className="bg-[#1a1a1a] border-gray-700 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {/* 커버 이미지 (Placeholder or from Author data if available) */}
        <div className="relative h-24 w-full bg-gradient-to-r from-blue-900 to-purple-900">
          {/* Optional: Add a cover image based on author data if needed */}
          {/* <Image src={author.cover_url} alt="Profile cover" fill className="object-cover opacity-40" /> */}
        </div>
        
        {/* 프로필 정보 */}
        <div className="p-3 relative">
          {/* 프로필 이미지 - 커버 이미지와 겹치게 */}
          <div className="absolute -top-10 left-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-base font-medium border-3 border-[#1a1a1a] overflow-hidden">
              {author?.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author?.username || 'User'}
                  fill
                  className="object-cover"
                  // Ensure hostname is configured in next.config.js if it's external
                  unoptimized={author.avatar_url.startsWith('http')} 
                />
              ) : (
                author?.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
          </div>
          
          {/* 유저 정보 */}
          <div className="mt-6 pt-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-white">{author?.username || 'Unknown User'}</h3>
                <p className="text-gray-400 text-xs">Joined {formattedDate}</p>
              </div>
              {/* TODO: Implement Follow logic */}
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-0 h-7 text-xs">
                Follow
              </Button>
            </div>
            
            {author?.bio && (
              <p className="text-gray-300 my-2 text-xs line-clamp-2">{author.bio}</p>
            )}
            
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-center">
                <div className="text-white font-medium text-sm">{authorPostCount}</div>
                <div className="text-xs text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                {/* Using post?.likes_count, ensure post prop is passed */}
                <div className="text-white font-medium text-sm">{post?.likes_count ?? 0}</div> 
                <div className="text-xs text-gray-400">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-white font-medium text-sm">{author?.followers_count ?? 0}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
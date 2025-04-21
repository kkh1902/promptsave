'use client';

import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share2, MoreVertical, Edit, Flag, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PostActionsProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  authorId?: string | null;
  currentUserId?: string | null;
  onLike: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export function PostActions({ 
  postId, 
  likeCount, 
  commentCount, 
  authorId,
  currentUserId,
  onLike, 
  onDelete 
}: PostActionsProps) {
  const router = useRouter();
  const isOwner = currentUserId && authorId && currentUserId === authorId;

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${postId}`); 
    toast.success('게시물 링크가 복사되었습니다.');
  };

  const handleEdit = () => {
    if (!isOwner) return;
    router.push(`/posts/${postId}/edit`);
  };
  
  const handleDelete = async () => {
    if (!isOwner) return;
    if (window.confirm('정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await onDelete();
      } catch (error) {
        console.error("Error during onDelete call:", error); 
      }
    }
  };

  const handleReport = () => {
      console.log('Report clicked for post:', postId);
      toast.info('신고 기능은 아직 구현되지 않았습니다.');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="bg-[#232323] text-gray-300 border-gray-700 hover:bg-[#2a2a2a] flex items-center gap-1"
        onClick={onLike}
        aria-label={`Like post, current likes: ${likeCount}`}
      >
        <Heart className="h-4 w-4" />
        <span>{likeCount}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-[#232323] text-gray-300 border-gray-700 hover:bg-[#2a2a2a] flex items-center gap-1"
        aria-label={`View comments, current comments: ${commentCount}`}
        onClick={() => { 
            const commentsSection = document.getElementById('comments-section');
            if (commentsSection) {
                commentsSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.warn('Comments section not found for scrolling.');
            }
        }}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{commentCount}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-[#232323] text-gray-300 border-gray-700 hover:bg-[#2a2a2a]"
        onClick={handleShare}
        aria-label="Share post"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#232323] text-gray-300 border-gray-700 hover:bg-[#2a2a2a]"
            aria-label="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-700 text-gray-200">
          {isOwner && (
            <>
              <DropdownMenuItem 
                className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer"
                onSelect={handleEdit}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>수정하기</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-red-900/50 focus:bg-red-900/50 cursor-pointer text-red-400 focus:text-red-300"
                onSelect={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>삭제하기</span>
              </DropdownMenuItem>
            </>
          )}
          {!isOwner && (
             <DropdownMenuItem 
                className="hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] cursor-pointer text-red-400 focus:text-red-400"
                onSelect={handleReport}
             >
                <Flag className="mr-2 h-4 w-4" />
                <span>신고하기</span>
             </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, MoreVertical, Trash2, Pencil } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GalleryItem as GalleryItemType } from "@/hooks/useGallery"
import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface GalleryItemProps {
  item: GalleryItemType & { width?: number; height?: number };
  type?: string
  currentUser: any
  onDeleteItem?: (itemId: string, itemType: string) => Promise<any>
  onEditItem?: (itemId: string, itemType: string) => void
}

export function GalleryItem({ item, type = 'post', currentUser, onDeleteItem, onEditItem }: GalleryItemProps) {
  const [userName, setUserName] = useState('User')
  const [avatarUrl, setAvatarUrl] = useState('')
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (item.user_id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', item.user_id)
            .single()
            
          if (data) {
            setUserName(data.username || 'Anonymous')
            setAvatarUrl(data.avatar_url || '')
          }
        } catch (error) {
          console.error('Error fetching user info:', error)
        }
      }
    }
    
    fetchUserInfo()
  }, [item.user_id])

  // 첫 번째 이미지 URL 가져오기 (있는 경우)
  const thumbnailUrl = item.image_urls && item.image_urls.length > 0 
    ? item.image_urls[0] 
    : 'https://via.placeholder.com/500x500'

  // 태그 클릭 핸들러
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const params = new URLSearchParams(searchParams.toString());
    const currentTags = params.get('tags');
    
    if (currentTags) {
      // 이미 선택된 태그들이 있는 경우
      const tagArray = currentTags.split(',');
      if (!tagArray.includes(tag)) {
        tagArray.push(tag);
        params.set('tags', tagArray.join(','));
      }
    } else {
      // 선택된 태그가 없는 경우
      params.set('tags', tag);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // 아이템 타입에 따라 다른 상세 페이지 경로 결정
  const getDetailPageUrl = () => {
    // 먼저 item의 type 속성을 확인 (데이터에 타입 정보가 있는 경우)
    let contentType = item.type || type;
    
    // 경로에서 타입 추론 (pathname이 /images, /videos 등이면 그에 맞게 설정)
    if (pathname.includes('/images')) {
      contentType = 'image';
    } else if (pathname.includes('/videos')) {
      contentType = 'video';
    } else if (pathname.includes('/posts')) {
      contentType = 'post';
    }
    
    // 아이템 ID가 없는 경우 기본 경로로 리디렉션
    if (!item.id) {
      console.error('아이템 ID가 없습니다:', item);
      return '/';
    }
    
    switch (contentType) {
      case 'image':
        return `/images/${item.id}`; // 아이템 ID를 사용하여 이미지 상세 페이지 경로 생성
      case 'video':
        return `/videos/${item.id}`; // 아이템 ID를 사용하여 비디오 상세 페이지 경로 생성
      case 'model':
        return `/models/${item.id}`; // 아이템 ID를 사용하여 모델 상세 페이지 경로 생성
      case 'development':
        return `/development/${item.id}`; // 아이템 ID를 사용하여 개발 상세 페이지 경로 생성
      case 'challenge':
        return `/challenges/${item.id}`; // 아이템 ID를 사용하여 챌린지 상세 페이지 경로 생성
      case 'shop':
        return `/shop/${item.id}`; // 아이템 ID를 사용하여 상점 상세 페이지 경로 생성
      case 'post':
      default:
        return `/posts/${item.id}`; // 아이템 ID를 사용하여 포스트 상세 페이지 경로 생성
    }
  };

  const detailPageUrl = getDetailPageUrl();

  const isOwner = currentUser?.id === item.user_id;

  // 삭제 확인 및 실행 함수
  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 링크 이동 방지
    
    if (!isOwner || !onDeleteItem) return;

    // 간단한 확인 창 (AlertDialog 컴포넌트를 사용하는 것이 더 좋음)
    if (window.confirm("정말 이 콘텐츠를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      const result = await onDeleteItem(item.id, item.type || type);
      if (result.success) {
        toast.success("콘텐츠가 삭제되었습니다.");
        // 성공 시 GalleryGrid가 자동으로 리렌더링됨 (상태 변경으로 인해)
      } else {
        toast.error(`삭제 실패: ${result.error}`);
      }
    }
  };

  // 수정 페이지로 이동하는 함수
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isOwner || !onEditItem) return;
    
    // GalleryItem 내부에서 직접 라우팅하거나, onEditItem prop을 통해 처리
    // 여기서는 onEditItem prop을 호출하여 상위에서 처리하도록 함
    onEditItem(item.id, item.type || type);
    // 또는 직접 라우팅: 
    // const editUrl = `/${item.type || type}/${item.id}/edit`; 
    // router.push(editUrl);
  };

  // 이미지 너비/높이 데이터 확인 (없으면 기본값 사용)
  const imageWidth = item.width || 500; // 기본 너비
  const imageHeight = item.height || 500; // 기본 높이

  return (
    <div className="relative group mb-3 break-inside-avoid overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-card">
      {isOwner && (onDeleteItem || onEditItem) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="destructive"
                size="icon" 
                className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEditItem && (
                <DropdownMenuItem 
                  onClick={handleEditClick} 
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  수정하기
                </DropdownMenuItem>
              )}
              {onDeleteItem && (
                <DropdownMenuItem 
                  onClick={handleDeleteClick} 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제하기
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      
      <Link href={detailPageUrl}>
        <Image
          src={thumbnailUrl}
          alt={item.title}
          width={imageWidth}
          height={imageHeight}
          layout="responsive"
          className="transition-transform group-hover:scale-105 duration-300"
          unoptimized={thumbnailUrl.startsWith('http')}
        />
      </Link>

      <div className="p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <Link href={`/profile?id=${item.user_id}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-5 w-5">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{userName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="line-clamp-1">{userName}</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" />
              <span>{item.likes_count ?? 0}</span>
            </div>
            {/* 조회수 부분 */}
            <div className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" />
              <span>{item.views_count ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
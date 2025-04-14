import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, MoreVertical } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GalleryItem as GalleryItemType } from "@/hooks/useGallery"
import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface GalleryItemProps {
  item: GalleryItemType
}

export function GalleryItem({ item }: GalleryItemProps) {
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
    : 'https://images.unsplash.com/photo-1635776062129-a74c10350adf?q=80&w=1032&auto=format&fit=crop'

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <Link href={`/post/${item.id}`}>
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt={item.title}
              fill
              unoptimized={thumbnailUrl.startsWith('http')}
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Link href={`/post/${item.id}`}>
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary">
                {item.title}
              </h3>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Options</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.content}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags && item.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-2 py-0 text-xs cursor-pointer hover:bg-primary/20"
                onClick={(e) => handleTagClick(e, tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{userName}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span className="text-xs">{item.likes_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span className="text-xs">{item.views_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-xs">{item.comments_count}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 
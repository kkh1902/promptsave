'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface GalleryItem {
  id: string
  title: string
  content: string
  image_urls?: string[] | null
  category: string
  created_at: string
  user_id: string
  tags: string[]
  likes_count: number
  views_count: number
  comments_count: number
  status: string
}

// 타입에 따른 테이블 이름 가져오기
function getTableName(type: string): string {
  switch (type) {
    case 'post':
      return 'posts';
    case 'development':
      return 'development_posts';
    case 'image':
      return 'images';
    case 'video':
      return 'videos';
    case 'model':
      return 'ai_models';
    case 'challenge':
      return 'challenges';
    case 'shop':
      return 'shop_items';
    default:
      return 'posts';
  }
}

// 갤러리 데이터 가져오기
export function useGalleryQuery(category: string = "ALL", type: string = 'post') {
  return useQuery({
    queryKey: ['gallery', type, category],
    queryFn: async () => {
      const tableName = getTableName(type);
      
      console.log(`Fetching items from ${tableName} with category:`, { category });
      
      try {
        let query = supabase
          .from(tableName)
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
  
        if (category !== "ALL") {
          query = query.eq('category', category);
        }
  
        const { data, error } = await query;
  
        if (error) {
          console.error('Supabase query error:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }
  
        console.log(`Fetched data from ${tableName}:`, data);
        return data || [];
      } catch (error) {
        console.error('Error fetching gallery items:', error);
        throw error;
      }
    }
  });
}

// 태그로 필터링된 아이템 가져오기
export function useFilteredGalleryItems(items: GalleryItem[] = [], tags: string[] = []) {
  if (!tags.length) return items;
  
  return items.filter(item => {
    return tags.some(tag => 
      item.tags && item.tags.includes(tag)
    );
  });
} 
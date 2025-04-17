import { useState, useEffect } from 'react'
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
  type?: string
}

export function useGallery(category: string = "ALL", type: string = 'post') {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        setError(null)

        // 콘텐츠 타입에 따라 다른 테이블 선택
        let tableName: string;
        
        switch (type) {
          case 'post':
            tableName = 'posts';
            break;
          case 'development':
            tableName = 'development_posts';
            break;
          case 'image':
            tableName = 'images';
            break;
          case 'video':
            tableName = 'videos';
            break;
          case 'model':
            tableName = 'ai_models';
            break;
          case 'challenge':
            tableName = 'challenges';
            break;
          case 'shop':
            tableName = 'shop_items';
            break;
          default:
            tableName = 'posts';
        }

        console.log(`Fetching items from ${tableName} with category:`, { category });

        let query = supabase
          .from(tableName)
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })

        if (category !== "ALL") {
          query = query.eq('category', category)
        }

        const { data, error: queryError } = await query

        if (queryError) {
          console.error('Supabase query error:', {
            code: queryError.code,
            message: queryError.message,
            details: queryError.details,
            hint: queryError.hint
          })
          throw queryError
        }

        console.log(`Fetched data from ${tableName}:`, data);
        
        // 불러온 데이터에 type 속성 추가하기
        const itemsWithType = data ? data.map(item => ({
          ...item,
          type: type // 현재 함수에 전달된 type 파라미터 사용
        })) : [];
        
        setItems(itemsWithType)
      } catch (err) {
        console.error('Error in fetchItems:', {
          error: err,
          stack: err instanceof Error ? err.stack : undefined,
          message: err instanceof Error ? err.message : 'Unknown error'
        })
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [category, type])

  return { items, loading, error }
} 
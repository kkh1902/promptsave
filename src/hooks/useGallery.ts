import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  video_url?: string | null
  media_type?: 'image' | 'video'
  category: string
  created_at: string
  user_id: string
  likes: number
  views: number
  comments: number
  user_name: string
  user_avatar: string
}

export function useGallery(category: string = "ALL", mediaType?: 'image' | 'video') {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        setError(null)

        console.log('Fetching gallery items with params:', { category, mediaType })

        let query = supabase
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false })

        if (category !== "ALL") {
          query = query.eq('category', category)
        }

        if (mediaType) {
          try {
            query = query.eq('media_type', mediaType)
          } catch (err) {
            console.warn('media_type 필터링을 건너뜁니다:', err)
          }
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

        const processedData = data?.map(item => ({
          ...item,
          video_url: item.video_url || null
        })) || []

        console.log('Fetched data:', processedData)
        setItems(processedData)
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
  }, [category, mediaType])

  return { items, loading, error }
} 
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
}

export function useGallery(category: string = "ALL") {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        setError(null)

        console.log('Fetching posts with params:', { category })

        let query = supabase
          .from('posts')
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

        console.log('Fetched posts data:', data)
        setItems(data || [])
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
  }, [category])

  return { items, loading, error }
} 
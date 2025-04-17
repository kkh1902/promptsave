import { supabase, GalleryItem } from '@/lib/supabase'

export async function getGalleryItems(category?: string): Promise<GalleryItem[]> {
  let query = supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false })

  if (category && category !== 'ALL') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching gallery items:', error)
    return []
  }

  return data || []
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching gallery item:', error)
    return null
  }

  return data
} 
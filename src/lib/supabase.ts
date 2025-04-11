import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface GalleryItem {
  id: string
  title: string
  description: string
  image_url: string
  created_at: string
  category: string
  likes: number
  views: number
  comments: number
  user_id: string
  user_name: string
  user_avatar: string
} 
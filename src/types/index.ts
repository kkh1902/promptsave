export interface GalleryItem {
  id: string
  title: string
  author: string
  authorAvatar: string
  imageUrl: string
  likes: number
  views: number
  comments: number
  verified?: boolean
  tags?: string[]
  rating?: number
  downloads?: number
  borderColor?: string
} 
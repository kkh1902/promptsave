export interface GalleryItem {
  id: number
  title: string
  imageUrl: string
  author: string
  authorAvatar: string
  likes: string | number
  downloads: string | number
  views: string | number
  comments: string | number
  rating: string
  tags: string[]
} 
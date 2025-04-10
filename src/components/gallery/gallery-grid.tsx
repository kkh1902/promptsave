import { motion } from "framer-motion"
import { GalleryItem } from "./gallery-item"

interface GalleryItem {
  id: string
  imageUrl: string
  title: string
  author: string
  authorAvatar: string
  likes: number
  views: number
  comments: number
  rating: number
}

interface GalleryGridProps {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {items.map((item, index) => (
        <GalleryItem
          key={item.id}
          {...item}
          index={index}
          variants={cardVariants}
        />
      ))}
    </div>
  )
} 
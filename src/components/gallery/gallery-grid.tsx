import { motion } from "framer-motion"
import { GalleryItem } from "./gallery-item"
import { GalleryItem as GalleryItemType } from "@/hooks/useGallery"

interface GalleryGridProps {
  items: GalleryItemType[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GalleryItem item={item} />
        </motion.div>
      ))}
    </div>
  )
} 
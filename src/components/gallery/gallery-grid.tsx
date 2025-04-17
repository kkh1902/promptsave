import { GalleryItem } from "./gallery-item"
import { GalleryItem as GalleryItemType } from "@/hooks/useGallery"
import { motion, AnimatePresence } from "framer-motion"

interface GalleryGridProps {
  items: GalleryItemType[]
  type?: string
}

export function GalleryGrid({ items, type = 'post' }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: "easeOut"
            }}
          >
            <GalleryItem item={item} type={type} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 
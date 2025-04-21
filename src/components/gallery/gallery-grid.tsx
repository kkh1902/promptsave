import Masonry from 'react-masonry-css'
import { GalleryItem } from "./gallery-item"
import { GalleryItem as GalleryItemType } from "@/hooks/useGallery"
import { motion, AnimatePresence } from "framer-motion"

interface GalleryGridProps {
  items: GalleryItemType[]
  type?: string
  currentUser: any;
  onDeleteItem?: (itemId: string, itemType: string) => Promise<any>;
  onEditItem?: (itemId: string, itemType: string) => void;
}

const breakpointColumnsObj = {
  default: 6,
  1536: 5,
  1280: 4,
  1024: 3,
  768: 2,
  640: 2
};

export function GalleryGrid({ items, type = 'post', currentUser, onDeleteItem, onEditItem }: GalleryGridProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {items.map((item, index) => (
        <motion.div 
          key={item.id} 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <GalleryItem 
            item={item} 
            type={type} 
            currentUser={currentUser}
            onDeleteItem={onDeleteItem}
            onEditItem={onEditItem}
          />
        </motion.div>
      ))}
    </Masonry>
  )
} 
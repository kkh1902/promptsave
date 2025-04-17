import { motion } from "framer-motion"

export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonItem key={index} index={index} />
      ))}
    </div>
  )
}

function SkeletonItem({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="overflow-hidden rounded-lg bg-zinc-800/40 border border-zinc-800"
    >
      <div className="aspect-video bg-zinc-800/80 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-zinc-800 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-full" />
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-2/3" />
        <div className="flex gap-2 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 bg-zinc-800 rounded-full animate-pulse w-16" />
          ))}
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-20" />
          </div>
          <div className="flex gap-3">
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-12" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-12" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-12" />
          </div>
        </div>
      </div>
    </motion.div>
  )
} 
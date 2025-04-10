import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, Star, MoreVertical } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GalleryItemProps {
  id: string
  imageUrl: string
  title: string
  author: string
  authorAvatar: string
  likes: number
  views: number
  comments: number
  rating: number
  index: number
  variants: {
    hidden: { opacity: number; y: number }
    visible: (i: number) => {
      opacity: number
      y: number
      transition: {
        delay: number
        duration: number
        ease: string
      }
    }
  }
}

export function GalleryItem({
  id,
  imageUrl,
  title,
  author,
  authorAvatar,
  likes,
  views,
  comments,
  rating,
  index,
  variants,
}: GalleryItemProps) {
  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num
  }

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full bg-card/50 hover:bg-card transition-colors border-muted">
        <div className="relative aspect-[3/4] group">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <div className="w-full">
              <h3 className="font-medium text-white truncate">{title}</h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-3">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={authorAvatar} alt={author} />
              <AvatarFallback>{author.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate">{author}</span>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between text-xs text-muted-foreground">
          <TooltipProvider>
            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Heart className="h-3.5 w-3.5 mr-1 text-rose-500" />
                    <span>{formatNumber(likes)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{likes} Likes</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    <span>{formatNumber(views)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{views} Views</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    <span>{formatNumber(comments)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{comments} Comments</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <Badge variant="secondary" className="flex items-center px-1.5 py-0.5">
            <Star className="h-3 w-3 mr-0.5 fill-amber-500 text-amber-500" />
            <span>{rating}</span>
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 
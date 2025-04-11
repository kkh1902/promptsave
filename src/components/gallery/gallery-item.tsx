import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, Star, MoreVertical } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GalleryItem as GalleryItemType } from "@/hooks/useGallery"

interface GalleryItemProps {
  item: GalleryItemType
}

export function GalleryItem({ item }: GalleryItemProps) {
  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num
  }

  return (
    <Link href={`/challenges/${item.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-all hover:border-gray-700">
        <div className="aspect-square overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-1 text-sm font-medium text-white">{item.title}</h3>
          <div className="flex items-center space-x-2">
            <img
              src={item.user_avatar}
              alt={item.user_name}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-xs text-gray-400">{item.user_name}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <span>{formatNumber(item.likes)} likes</span>
              <span>•</span>
              <span>{formatNumber(item.views)} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span>{formatNumber(item.comments)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
} 
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, Star, MoreVertical, Award } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { galleryItems } from "@/data/sample-data"
import { Navigation } from "@/components/navigation"

export default function ModelsPage() {
  // Format large numbers with k suffix
  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num
  }

  // Animation variants for cards
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
    <ThemeProvider defaultTheme="dark" attribute="class">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation />

        {/* Featured Banner */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="relative rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-6 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
                <Award className="h-8 w-8 text-amber-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Featured Models</h2>
                <p className="text-muted-foreground max-w-3xl">
                  Discover and download the best AI models created by our community. From Stable Diffusion checkpoints to
                  custom LoRAs, find everything you need to create amazing AI art.
                </p>
              </div>
              <Button variant="outline" className="mt-4 md:mt-0">
                Explore all models
              </Button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card className="overflow-hidden h-full bg-card/50 hover:bg-card transition-colors border-muted">
                  <div className="relative aspect-[3/4] group">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div className="w-full">
                        <h3 className="font-medium text-white truncate">{item.title}</h3>
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
                        <AvatarImage src={item.authorAvatar} alt={item.author} />
                        <AvatarFallback>{item.author.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">{item.author}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between text-xs text-muted-foreground">
                    <TooltipProvider>
                      <div className="flex items-center space-x-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Heart className="h-3.5 w-3.5 mr-1 text-rose-500" />
                              <span>{formatNumber(item.likes)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.likes} Likes</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              <span>{formatNumber(item.views)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.views} Views</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <MessageSquare className="h-3.5 w-3.5 mr-1" />
                              <span>{formatNumber(item.comments)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.comments} Comments</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>

                    <Badge variant="secondary" className="flex items-center px-1.5 py-0.5">
                      <Star className="h-3 w-3 mr-0.5 fill-amber-500 text-amber-500" />
                      <span>{item.rating}</span>
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t py-6 md:py-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
            <p className="text-sm text-muted-foreground">© Civitai {new Date().getFullYear()}. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Safety
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                API
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
} 
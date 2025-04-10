"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, Star, MoreVertical, ShoppingCart } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { galleryItems } from "@/data/sample-data"
import { Navigation } from "@/components/navigation"
import { Banner } from "@/components/banner/banner"
import { Footer } from "@/components/footer/footer"
import { GalleryGrid } from "@/components/gallery/gallery-grid"

export default function ShopPage() {
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
        <Banner
          title="AI Art Shop"
          description="Discover and purchase unique AI-generated artworks, prints, and digital assets. Support artists and bring AI art into your collection."
          buttonText="Browse all items"
        />

        {/* Gallery */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <GalleryGrid items={galleryItems} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
} 
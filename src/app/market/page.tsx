"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, Star, MoreVertical } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Navigation } from "@/components/navigation/navigation"
import { Banner } from "@/components/banner/banner"
import { Footer } from "@/components/footer/footer"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { CategoryNavigation } from "@/components/category/category-navigation"
import { Filter } from "@/components/filter/filter"
import { useGallery } from "@/hooks/useGallery"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "character", label: "Character" },
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
  { value: "concept", label: "Concept Art" },
  { value: "anime", label: "Anime" },
  { value: "realistic", label: "Realistic" },
]

const models = [
  { value: "all", label: "All Models" },
  { value: "sd_xl", label: "Stable Diffusion XL" },
  { value: "sd_15", label: "Stable Diffusion 1.5" },
  { value: "dalle", label: "DALL-E" },
  { value: "midjourney", label: "Midjourney" },
]

export default function MarketPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const { items: galleryItems, loading, error } = useGallery(selectedCategory)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation />
        <CategoryNavigation />

        {/* Featured Banner */}
        <Banner
          title="AI Market"
          description="Buy and sell AI-generated art, models, and resources. Support creators and find unique digital assets."
          buttonText="View all items"
        />

        {/* Gallery */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <Filter type="image" onCategoryChange={handleCategoryChange} />
          <GalleryGrid items={galleryItems} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
} 
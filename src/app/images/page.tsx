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

export default function ImagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const { items: galleryItems, loading, error } = useGallery(selectedCategory, 'image')

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
        <CategoryNavigation 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          type="image"
        />

        {/* Featured Banner */}
        <Banner
          title="AI Generated Images"
          description="Explore amazing AI-generated images created by our community. From stunning landscapes to creative portraits."
          buttonText="View all images"
        />

        {/* Gallery */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <Filter type="image" onCategoryChange={handleCategoryChange} />
          <GalleryGrid items={galleryItems} type="image" />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
} 
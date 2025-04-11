"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, Star, MoreVertical, Award, Calendar, Users } from "lucide-react"

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

export default function ChallengesPage() {
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
          title="AI Art Challenges"
          description="Participate in exciting AI art challenges and showcase your creativity. Win prizes, gain recognition, and push the boundaries of AI-generated art."
          buttonText="View all challenges"
        />

        {/* Gallery */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <Filter type="challenge" onCategoryChange={handleCategoryChange} />
          <GalleryGrid items={galleryItems} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
} 
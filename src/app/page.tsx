"use client"

import { useState, useEffect } from "react"
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
import { useGallery, GalleryItem } from "@/hooks/useGallery"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [combinedItems, setCombinedItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 각 카테고리별 데이터 불러오기
  const { 
    items: imageItems, 
    loading: imageLoading, 
    error: imageError 
  } = useGallery(selectedCategory, 'image')
  
  const { 
    items: modelItems, 
    loading: modelLoading, 
    error: modelError 
  } = useGallery(selectedCategory, 'model')
  
  const { 
    items: videoItems, 
    loading: videoLoading, 
    error: videoError 
  } = useGallery(selectedCategory, 'video')

  // 데이터 결합
  useEffect(() => {
    const allLoaded = !imageLoading && !modelLoading && !videoLoading
    const anyError = imageError || modelError || videoError
    
    if (allLoaded) {
      setLoading(false)
      
      if (anyError) {
        setError(anyError)
      } else {
        // 모든 항목을 결합하고 생성일 기준으로 정렬
        const combined = [
          ...imageItems.map(item => ({ ...item, source: 'image' })),
          ...modelItems.map(item => ({ ...item, source: 'model' })),
          ...videoItems.map(item => ({ ...item, source: 'video' }))
        ].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        
        setCombinedItems(combined)
      }
    }
  }, [
    imageItems, imageLoading, imageError,
    modelItems, modelLoading, modelError,
    videoItems, videoLoading, videoError
  ])

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
        />

        {/* Featured Banner */}
        <Banner
          title="AI 갤러리"
          description="이미지, 모델, 비디오 등 AI 생성 콘텐츠를 탐색하고 공유하세요. 커뮤니티의 놀라운 창작물을 발견하세요."
          buttonText="모든 콘텐츠 보기"
        />

        {/* Gallery */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <GalleryGrid items={combinedItems} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
}

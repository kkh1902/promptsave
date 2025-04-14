"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Eye, MessageSquare, Star, MoreVertical } from "lucide-react"
import { useSearchParams } from "next/navigation"

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
import { GallerySkeleton } from "@/components/gallery/gallery-skeleton"
import { CategoryNavigation } from "@/components/category/category-navigation"
import { Filter } from "@/components/filter/filter"
import { useGalleryQuery, useFilteredGalleryItems } from "@/hooks/useGalleryQuery"
import { useGallery } from "@/hooks/useGallery"

export default function VideosPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || "ALL";
  const tagParam = searchParams.get('tags');
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tagParam ? tagParam.split(',') : []
  );
  
  // 기존 방식으로 백업 데이터 가져오기 (임시, 이후 삭제 가능)
  const { items: backupItems } = useGallery(selectedCategory, 'video');

  // React Query로 데이터 가져오기
  const { data: galleryItems = [], isLoading, isError, error } = useGalleryQuery(selectedCategory, 'video');

  // 데이터가 있으면 React Query의 데이터를 사용하고, 없으면 백업 데이터 사용
  const items = galleryItems.length > 0 ? galleryItems : backupItems;
  
  // 태그 필터링된 아이템
  const filteredItems = useFilteredGalleryItems(items, selectedTags);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  }

  // URL 쿼리 파라미터 업데이트를 위한 useEffect
  useEffect(() => {
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    
    if (category) {
      setSelectedCategory(category);
    }
    
    if (tags) {
      setSelectedTags(tags.split(','));
    }
  }, [searchParams]);

  if (isError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Error: {error instanceof Error ? error.message : 'An error occurred'}</p>
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
          type="video"
        />

        {/* Featured Banner */}
        <Banner
          title="AI Generated Videos"
          description="Discover amazing AI-generated videos created by our community. From short clips to full animations."
          buttonText="View all videos"
        />

        {/* 선택된 태그 표시 */}
        {selectedTags.length > 0 && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Selected tags:</span>
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer"
                  onClick={() => {
                    const newTags = selectedTags.filter(t => t !== tag);
                    setSelectedTags(newTags);
                    
                    // URL 업데이트
                    const params = new URLSearchParams(searchParams.toString());
                    if (newTags.length === 0) {
                      params.delete('tags');
                    } else {
                      params.set('tags', newTags.join(','));
                    }
                    window.history.pushState({}, '', `?${params.toString()}`);
                  }}
                >
                  {tag} ✕
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedTags([]);
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete('tags');
                  window.history.pushState({}, '', `?${params.toString()}`);
                }}
              >
                Clear all
              </Button>
            </div>
          </div>
        )}

        {/* Gallery */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <Filter type="video" onCategoryChange={handleCategoryChange} />
          
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GallerySkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GalleryGrid items={filteredItems} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
} 
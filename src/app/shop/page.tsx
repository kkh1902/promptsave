"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Eye, MessageSquare, Star, MoreVertical, ShoppingCart, Tag, Package } from "lucide-react"
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
import { CategoryNavigation } from "@/components/category/category-navigation"
import { Filter } from "@/components/filter/filter"
import { useGallery } from "@/hooks/useGallery"

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || "ALL";
  const tagParam = searchParams.get('tags');
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tagParam ? tagParam.split(',') : []
  );
  
  const { items: galleryItems, loading, error } = useGallery(selectedCategory, 'shop');

  // 태그 필터링된 아이템
  const filteredItems = selectedTags.length > 0 
    ? galleryItems.filter(item => {
        return selectedTags.some(tag => 
          item.tags && item.tags.includes(tag)
        );
      })
    : galleryItems;

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
          type="shop"
        />

        {/* Featured Banner */}
        <Banner
          title="AI Art Shop"
          description="Shop for unique AI-generated art pieces. Support artists and find one-of-a-kind digital artworks."
          buttonText="View all items"
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
          <Filter type="shop" onCategoryChange={handleCategoryChange} />
          <GalleryGrid items={filteredItems} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ThemeProvider>
  )
} 
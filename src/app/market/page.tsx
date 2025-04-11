"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter as FilterIcon, Search } from "lucide-react"

import { Navigation } from "@/components/navigation/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "@/components/filter/filter"

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
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedModel, setSelectedModel] = useState("all")

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Filter type="image" />

      <div className="container px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Filters */}
          <div className="w-full lg:w-64 space-y-4 sticky top-[105px]">
            <div className="p-4 rounded-lg border bg-card">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Category</h3>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Model</h3>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Price</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Free
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      Paid
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Rating</h3>
                  <div className="space-y-1.5">
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      5 Stars
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      4+ Stars
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      3+ Stars
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search prompts..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
              {/* Cards will be rendered here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
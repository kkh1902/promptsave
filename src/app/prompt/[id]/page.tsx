"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Download,
  Eye,
  FlameKindling as Fire,
  Heart,
  Info,
  MessageSquare,
  MoreHorizontal,
  PenTool,
  Share2,
  Shield,
  ThumbsUp,
  Zap,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample prompt data
const promptData = {
  id: "midjourney-prompt-master",
  name: "Midjourney Prompt Master",
  type: "PROMPT COLLECTION",
  baseModel: "Midjourney",
  creator: {
    id: "promptmaster",
    name: "PromptMaster",
    avatar: "/placeholder.svg?height=100&width=100",
    joined: "Jan 15, 2024",
    followers: "5.2K",
  },
  stats: {
    likes: 12500,
    downloads: 156800,
    views: 420000,
    bookmarks: 3800,
    energy: 89700,
  },
  versions: [
    { version: "v3.0", isLatest: true },
    { version: "v2.0" },
    { version: "v1.0" },
  ],
  tags: ["MIDJOURNEY", "LANDSCAPE", "PORTRAIT", "CONCEPT ART"],
  updated: "Apr 15, 2024",
  published: "Apr 15, 2024",
  images: [
    {
      id: 1,
      url: "/placeholder.svg?height=600&width=400",
      likes: 1196,
      dislikes: 93,
      comments: 139,
      views: 29000,
    },
    {
      id: 2,
      url: "/placeholder.svg?height=600&width=400",
      likes: 861,
      dislikes: 83,
      comments: 120,
      views: 17000,
    },
  ],
  details: {
    generation: "Trending",
    reviews: "Very Positive (1,226)",
    usageTips: "Add --v 6.0 at the end",
    category: "Landscape & Scenery",
    style: "Photorealistic",
  },
  files: [
    {
      name: "Landscape Collection",
      size: "125 KB",
      verified: true,
      verifiedDays: 3,
      format: "TXT",
    },
  ],
  license: "Creative Commons",
  description:
    "A comprehensive collection of Midjourney prompts optimized for creating stunning landscapes and environmental concepts. Each prompt is carefully crafted to produce consistent, high-quality results with a focus on lighting, atmosphere, and detail.",
}

// Format large numbers with k, M suffix
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export default function PromptDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)
  const [isFilesOpen, setIsFilesOpen] = useState(true)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % promptData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + promptData.images.length) % promptData.images.length)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-[#2A2A2A] bg-[#1A1A1A]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1A1A1A]/60">
        <div className="container py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="text-gray-400 hover:text-white">
                <Link href="#">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-bold md:text-2xl">{promptData.name}</h1>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Shield className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-gray-400">
                <ThumbsUp className="h-4 w-4" />
                <span>{formatNumber(promptData.stats.likes)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Download className="h-4 w-4" />
                <span>{formatNumber(promptData.stats.downloads)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(promptData.stats.views)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Bookmark className="h-4 w-4" />
                <span>{formatNumber(promptData.stats.bookmarks)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Zap className="h-4 w-4" />
                <span>{formatNumber(promptData.stats.energy)}</span>
              </div>
              <div className="ml-auto text-xs text-gray-400">Updated: {promptData.updated}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              {promptData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {promptData.versions.map((version) => (
                <Button
                  key={version.version}
                  size="sm"
                  variant={version.isLatest ? "default" : "ghost"}
                  className={`h-8 rounded-md ${
                    version.isLatest ? "" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <PenTool className="mr-1 h-3.5 w-3.5" />
                  {version.version}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-[1fr_350px]">
          {/* Left Column - Images */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={promptData.images[currentImageIndex].url || "/placeholder.svg"}
                  alt={`${promptData.name} preview ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                  onClick={prevImage}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between border-t border-[#2A2A2A] p-3">
                <div className="flex items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-gray-400 hover:text-white">
                          <Heart className={`h-4 w-4 ${true ? "fill-rose-500 text-rose-500" : ""}`} />
                          <span>{formatNumber(promptData.images[currentImageIndex].likes)}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Like</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-gray-400 hover:text-white">
                          <MessageSquare className="h-4 w-4" />
                          <span>{formatNumber(promptData.images[currentImageIndex].comments)}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Comments</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                          <span>{formatNumber(promptData.images[currentImageIndex].views)}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Views</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {promptData.images.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative min-w-[100px] overflow-hidden rounded-md border border-[#2A2A2A] ${
                    index === currentImageIndex ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0D0D0D]" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <div className="aspect-[3/4] w-[100px]">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Description */}
            <Card className="border-[#2A2A2A] bg-[#1A1A1A]">
              <CardContent className="p-4">
                <h3 className="mb-2 text-lg font-medium">Description</h3>
                <p className="text-sm text-gray-400">{promptData.description}</p>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="examples" className="border-[#2A2A2A]">
              <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A]">
                <TabsTrigger value="examples" className="data-[state=active]:bg-[#2A2A2A]">
                  Examples
                </TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-[#2A2A2A]">
                  Comments
                </TabsTrigger>
                <TabsTrigger value="versions" className="data-[state=active]:bg-[#2A2A2A]">
                  Version History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="examples" className="mt-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-md border border-[#2A2A2A]"
                    >
                      <Image
                        src={`/placeholder.svg?height=300&width=300&text=Example ${i}`}
                        alt={`Example ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="comments" className="mt-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=User${i}`} />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">User{i}</span>
                          <span className="text-xs text-gray-400">2 days ago</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          This prompt collection is amazing! The results are consistently high quality.
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-400 hover:text-white">
                            <Heart className="mr-1 h-3.5 w-3.5" />
                            <span className="text-xs">12</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-gray-400 hover:text-white">
                            <MessageSquare className="mr-1 h-3.5 w-3.5" />
                            <span className="text-xs">Reply</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="versions" className="mt-4">
                <div className="space-y-4">
                  {promptData.versions.map((version) => (
                    <div
                      key={version.version}
                      className="flex items-center justify-between rounded-md border border-[#2A2A2A] bg-[#1A1A1A] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-[#2A2A2A] text-gray-300">
                          {version.version}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {version.isLatest ? "Latest version" : "Previous version"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {version.isLatest ? promptData.updated : "Mar 15, 2024"}
                        </span>
                        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-white">
                          <Download className="mr-1 h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="border-[#2A2A2A] text-gray-400 hover:text-white">
                  <Heart className="mr-2 h-4 w-4" />
                  Like
                </Button>
                <Button variant="outline" className="border-[#2A2A2A] text-gray-400 hover:text-white">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" className="border-[#2A2A2A] text-gray-400 hover:text-white">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Creator Card */}
            <Card className="border-[#2A2A2A] bg-[#1A1A1A]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={promptData.creator.avatar} />
                    <AvatarFallback>{promptData.creator.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{promptData.creator.name}</div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 border-amber-500/20 bg-amber-500/10 px-1.5 py-0 text-amber-500"
                      >
                        <Fire className="h-3 w-3" />
                        <span className="text-xs">Creator</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Joined {promptData.creator.joined}</span>
                      <span>•</span>
                      <span>{promptData.creator.followers} followers</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-[#2A2A2A] text-gray-400 hover:text-white"
                  >
                    View Profile
                  </Button>
                  <Button className="ml-2 w-full bg-blue-500 hover:bg-blue-600" size="sm">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Details Collapsible */}
            <Collapsible
              open={isDetailsOpen}
              onOpenChange={setIsDetailsOpen}
              className="rounded-md border border-[#2A2A2A]"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between rounded-none p-4 font-medium hover:bg-[#2A2A2A]"
                >
                  Details
                  {isDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Type</div>
                    <div className="font-medium">{promptData.type}</div>
                  </div>
                  <Separator className="bg-[#2A2A2A]" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Stats</div>
                    <div className="flex items-center gap-2 font-medium">
                      <div className="flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />
                        <span>{formatNumber(promptData.stats.downloads)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{formatNumber(promptData.stats.views)}</span>
                      </div>
                    </div>
                  </div>
                  <Separator className="bg-[#2A2A2A]" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Generation</div>
                    <div className="font-medium">{promptData.details.generation}</div>
                  </div>
                  <Separator className="bg-[#2A2A2A]" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Reviews</div>
                    <div className="font-medium text-green-500">{promptData.details.reviews}</div>
                  </div>
                  <Separator className="bg-[#2A2A2A]" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Published</div>
                    <div className="font-medium">{promptData.published}</div>
                  </div>
                  <Separator className="bg-[#2A2A2A]" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Base Model</div>
                    <div className="font-medium">{promptData.baseModel}</div>
                  </div>
                  <Separator className="bg-[#2A2A2A]" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Usage Tips</div>
                    <div className="font-medium">{promptData.details.usageTips}</div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Files Collapsible */}
            <Collapsible
              open={isFilesOpen}
              onOpenChange={setIsFilesOpen}
              className="rounded-md border border-[#2A2A2A]"
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between rounded-none p-4 font-medium hover:bg-[#2A2A2A]"
                >
                  1 File
                  {isFilesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0">
                  {promptData.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-md border border-[#2A2A2A] bg-[#1A1A1A] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{file.name}</div>
                        <Badge variant="outline" className="border-[#2A2A2A] text-gray-300">
                          {file.size}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {file.verified && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-green-500" />
                            <span>Verified: {file.verifiedDays} days ago</span>
                          </div>
                        )}
                        {file.format && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-blue-500" />
                            <span>{file.format}</span>
                          </div>
                        )}
                      </div>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* License */}
            <div className="flex items-center justify-between rounded-md border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">License:</span>
                <span className="font-medium">{promptData.license}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View
              </Button>
            </div>

            {/* Related Prompts */}
            <div className="space-y-3">
              <h3 className="font-medium">Related Prompts</h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden border-[#2A2A2A] bg-[#1A1A1A]">
                    <div className="relative aspect-square">
                      <Image
                        src={`/placeholder.svg?height=150&width=150&text=Prompt ${i}`}
                        alt={`Related Prompt ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-2">
                      <div className="text-xs font-medium truncate">Related Prompt {i}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Heart className="h-3 w-3" />
                        <span>{Math.floor(Math.random() * 1000)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
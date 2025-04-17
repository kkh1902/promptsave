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
  FlameIcon as Fire,
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

// 데이터 타입 정의
export interface DetailImage {
  id: number
  url: string
  likes: number
  dislikes: number
  comments: number
  views: number
}

export interface DetailVersion {
  version: string
  isLatest?: boolean
}

export interface DetailFile {
  name: string
  size: string
  verified?: boolean
  verifiedDays?: number
  safeTensor?: boolean
}

export interface DetailData {
  id: string
  name: string
  type: string
  baseModel: string
  creator: {
    id: string
    name: string
    avatar: string
    joined: string
    followers: string
  }
  stats: {
    likes: number
    downloads: number
    views: number
    bookmarks: number
    energy: number
  }
  versions: DetailVersion[]
  tags: string[]
  updated: string
  published: string
  images: DetailImage[]
  details: {
    generation: string
    reviews: string
    usageTips: string
    hash: string
    air: string
  }
  files: DetailFile[]
  license: string
  description: string
}

interface DetailViewProps {
  data: DetailData
  backUrl: string
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

export function DetailView({ data, backUrl }: DetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)
  const [isFilesOpen, setIsFilesOpen] = useState(true)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % data.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + data.images.length) % data.images.length)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={backUrl}>
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-bold md:text-2xl line-clamp-1">{data.name}</h1>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Shield className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{formatNumber(data.stats.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{formatNumber(data.stats.downloads)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(data.stats.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bookmark className="h-4 w-4" />
                <span>{formatNumber(data.stats.bookmarks)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>{formatNumber(data.stats.energy)}</span>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">Updated: {data.updated}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {data.versions.map((version) => (
                <Button
                  key={version.version}
                  size="sm"
                  variant={version.isLatest ? "default" : "outline"}
                  className="h-8 rounded-md whitespace-nowrap"
                >
                  <PenTool className={`mr-1 h-3.5 w-3.5 ${version.isLatest ? "" : "text-muted-foreground"}`} />
                  {version.version}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Left Column - Images */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative overflow-hidden rounded-lg border bg-background">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={data.images[currentImageIndex].url || "/placeholder.svg"}
                  alt={`${data.name} preview ${currentImageIndex + 1}`}
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

              <div className="flex items-center justify-between border-t p-3">
                <div className="flex items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                          <Heart className={`h-4 w-4 ${true ? "fill-rose-500 text-rose-500" : ""}`} />
                          <span>{formatNumber(data.images[currentImageIndex].likes)}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Like</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{formatNumber(data.images[currentImageIndex].comments)}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Comments</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                          <Eye className="h-4 w-4" />
                          <span>{formatNumber(data.images[currentImageIndex].views)}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Views</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {data.images.map((image, index) => (
                <button
                  key={image.id}
                  className={`relative min-w-[100px] overflow-hidden rounded-md border ${
                    index === currentImageIndex ? "ring-2 ring-primary ring-offset-2" : ""
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
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-2 text-lg font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{data.description}</p>
              </CardContent>
            </Card>

            {/* Tabs for additional content */}
            <Tabs defaultValue="examples">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="versions">Version History</TabsTrigger>
              </TabsList>
              <TabsContent value="examples" className="mt-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-md border">
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
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm">
                          This model is amazing! I've been using it for all my projects and the results are incredible.
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Heart className="mr-1 h-3.5 w-3.5" />
                            <span className="text-xs">12</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
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
                  {data.versions.slice(0, 5).map((version) => (
                    <div key={version.version} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{version.version}</Badge>
                        <span className="text-sm">{version.isLatest ? "Latest version" : "Previous version"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {version.isLatest ? data.updated : "Mar 15, 2025"}
                        </span>
                        <Button variant="ghost" size="sm" className="h-8">
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
              <Button size="lg" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" className="truncate">
                  <Heart className="mr-2 h-4 w-4" />
                  Like
                </Button>
                <Button variant="outline" className="truncate">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" className="truncate">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Creator Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={data.creator.avatar} />
                    <AvatarFallback>{data.creator.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium truncate">{data.creator.name}</div>
                      <Badge variant="outline" className="flex shrink-0 items-center gap-1 px-1.5 py-0">
                        <Fire className="h-3 w-3 text-amber-500" />
                        <span className="text-xs">Creator</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">Joined {data.creator.joined}</span>
                      <span className="shrink-0">•</span>
                      <span className="truncate">{data.creator.followers} followers</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Details Collapsible */}
            <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen} className="rounded-md border">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between rounded-none p-4 font-medium"
                >
                  Details
                  {isDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Type</div>
                    <div className="font-medium truncate">{data.type}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Stats</div>
                    <div className="flex items-center gap-2 font-medium">
                      <div className="flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />
                        <span>{formatNumber(data.stats.downloads)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{formatNumber(data.stats.views)}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Generation</div>
                    <div className="font-medium truncate">{data.details.generation}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Reviews</div>
                    <div className="font-medium text-green-500 truncate">{data.details.reviews}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Published</div>
                    <div className="font-medium">{data.published}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Base Model</div>
                    <div className="font-medium truncate">{data.baseModel}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Usage Tips</div>
                    <div className="font-medium truncate">{data.details.usageTips}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Hash</div>
                    <div className="flex items-center gap-1 font-medium">
                      <span className="truncate">{data.details.hash}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">AIR</div>
                    <div className="flex items-center gap-1 font-medium">
                      <span className="truncate">{data.details.air}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Files Collapsible */}
            <Collapsible open={isFilesOpen} onOpenChange={setIsFilesOpen} className="rounded-md border">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between rounded-none p-4 font-medium"
                >
                  {data.files.length} File{data.files.length > 1 ? "s" : ""}
                  {isFilesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0">
                  {data.files.map((file, index) => (
                    <div key={index} className="flex flex-col gap-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate">{file.name}</div>
                        <Badge variant="outline">{file.size}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {file.verified && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-green-500" />
                            <span>Verified: {file.verifiedDays} days ago</span>
                          </div>
                        )}
                        {file.safeTensor && (
                          <div className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-blue-500" />
                            <span>SafeTensor</span>
                          </div>
                        )}
                      </div>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* License */}
            <div className="flex items-center justify-between rounded-md border p-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>License:</span>
                <span className="font-medium truncate">{data.license}</span>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>

            {/* Related Models */}
            <div className="space-y-3">
              <h3 className="font-medium">Related Models</h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={`/placeholder.svg?height=150&width=150&text=Model ${i}`}
                        alt={`Related Model ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-2">
                      <div className="text-xs font-medium truncate">Related Model {i}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
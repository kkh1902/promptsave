"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from '@supabase/supabase-js'
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

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

export default function ModelDetail({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDetailsOpen, setIsDetailsOpen] = useState(true)
  const [isFilesOpen, setIsFilesOpen] = useState(true)
  const [modelData, setModelData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        // 모델 기본 정보 가져오기
        const { data: model, error: modelError } = await supabase
          .from('models')
          .select('*')
          .eq('id', params.id)
          .single()

        if (modelError) throw modelError

        // 모델 통계 가져오기
        const { data: stats, error: statsError } = await supabase
          .from('model_stats')
          .select('*')
          .eq('model_id', params.id)
          .single()

        if (statsError) throw statsError

        // 모델 이미지 가져오기
        const { data: images, error: imagesError } = await supabase
          .from('model_images')
          .select('*')
          .eq('model_id', params.id)

        if (imagesError) throw imagesError

        // 모델 파일 가져오기
        const { data: files, error: filesError } = await supabase
          .from('model_files')
          .select('*')
          .eq('model_id', params.id)

        if (filesError) throw filesError

        // 모델 태그 가져오기
        const { data: tags, error: tagsError } = await supabase
          .from('model_tags')
          .select('tag')
          .eq('model_id', params.id)

        if (tagsError) throw tagsError

        // 모델 버전 가져오기
        const { data: versions, error: versionsError } = await supabase
          .from('model_versions')
          .select('*')
          .eq('model_id', params.id)
          .order('version', { ascending: false })

        if (versionsError) throw versionsError

        // 데이터 합치기
        setModelData({
          ...model,
          stats,
          images,
          files,
          tags: tags.map(t => t.tag),
          versions: versions.map(v => ({
            version: v.version,
            isLatest: v.is_latest
          }))
        })
      } catch (error) {
        console.error('Error fetching model data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModelData()
  }, [params.id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!modelData) {
    return <div>Model not found</div>
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % modelData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + modelData.images.length) % modelData.images.length)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/models">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-bold md:text-2xl">{modelData.name}</h1>
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
                <span>{formatNumber(modelData.stats.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{formatNumber(modelData.stats.downloads)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{formatNumber(modelData.stats.views)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bookmark className="h-4 w-4" />
                <span>{formatNumber(modelData.stats.bookmarks)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>{formatNumber(modelData.stats.energy)}</span>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">Updated: {modelData.updated}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              {modelData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {modelData.versions.map((version) => (
                <Button
                  key={version.version}
                  size="sm"
                  variant={version.isLatest ? "default" : "outline"}
                  className="h-8 rounded-md"
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
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-[1fr_350px]">
          {/* Left Column - Images */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative overflow-hidden rounded-lg border bg-background">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={modelData.images[currentImageIndex].url || "/placeholder.svg"}
                  alt={`${modelData.name} preview ${currentImageIndex + 1}`}
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
                          <span>{formatNumber(modelData.images[currentImageIndex].likes)}</span>
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
                          <span>{formatNumber(modelData.images[currentImageIndex].comments)}</span>
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
                          <span>{formatNumber(modelData.images[currentImageIndex].views)}</span>
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
              {modelData.images.map((image, index) => (
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
                <p className="text-sm text-muted-foreground">{modelData.description}</p>
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
                  {modelData.versions.slice(0, 5).map((version) => (
                    <div key={version.version} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{version.version}</Badge>
                        <span className="text-sm">{version.isLatest ? "Latest version" : "Previous version"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {version.isLatest ? modelData.updated : "Mar 15, 2025"}
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
                <Button variant="outline">
                  <Heart className="mr-2 h-4 w-4" />
                  Like
                </Button>
                <Button variant="outline">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Creator Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={modelData.creator.avatar} />
                    <AvatarFallback>{modelData.creator.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{modelData.creator.name}</div>
                      <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-0">
                        <Fire className="h-3 w-3 text-amber-500" />
                        <span className="text-xs">Creator</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Joined {modelData.creator.joined}</span>
                      <span>•</span>
                      <span>{modelData.creator.followers} followers</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between">
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                  <Button className="ml-2 w-full" size="sm">
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
                    <div className="font-medium">{modelData.type}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Stats</div>
                    <div className="flex items-center gap-2 font-medium">
                      <div className="flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" />
                        <span>{formatNumber(modelData.stats.downloads)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{formatNumber(modelData.stats.views)}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Generation</div>
                    <div className="font-medium">{modelData.details.generation}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Reviews</div>
                    <div className="font-medium text-green-500">{modelData.details.reviews}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Published</div>
                    <div className="font-medium">{modelData.published}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Base Model</div>
                    <div className="font-medium">{modelData.baseModel}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Usage Tips</div>
                    <div className="font-medium">{modelData.details.usageTips}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Hash</div>
                    <div className="flex items-center gap-1 font-medium">
                      <span>{modelData.details.hash}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">AIR</div>
                    <div className="flex items-center gap-1 font-medium">
                      <span>{modelData.details.air}</span>
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
                  1 File
                  {isFilesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0">
                  {modelData.files.map((file, index) => (
                    <div key={index} className="flex flex-col gap-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{file.name}</div>
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
                <span className="font-medium">{modelData.license}</span>
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
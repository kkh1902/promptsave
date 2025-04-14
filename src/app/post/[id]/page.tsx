"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Eye, MessageSquare, Star, MoreVertical, Download, ThumbsUp, MoreHorizontal, ChevronDown, Share2, ExternalLink, Copy } from "lucide-react"
import { createClient } from '@supabase/supabase-js'

import { Navigation } from "@/components/navigation/navigation"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Banner } from "@/components/banner/banner"
import { CategoryNavigation } from "@/components/category/category-navigation"
import { Footer } from "@/components/footer/footer"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function PostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<any>(null)
  const [author, setAuthor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTableExpanded, setIsTableExpanded] = useState(true)

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 포스트 데이터 가져오기
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single()

        if (postError) {
          console.error('포스트 조회 에러:', postError)
          throw new Error('포스트를 찾을 수 없습니다.')
        }

        setPost(postData)

        // 조회수 증가
        const { error: updateError } = await supabase
          .from('posts')
          .update({ views_count: (postData.views_count || 0) + 1 })
          .eq('id', postId)

        if (updateError) {
          console.error('조회수 업데이트 에러:', updateError)
        }

        // 작성자 정보 가져오기
        if (postData.user_id) {
          const { data: authorData, error: authorError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', postData.user_id)
            .single()

          if (authorError) {
            console.error('작성자 정보 조회 에러:', authorError)
          } else {
            setAuthor(authorData)
          }
        }
      } catch (err) {
        console.error('포스트 로드 중 에러:', err)
        setError(err instanceof Error ? err.message : '포스트를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPostData()
    }
  }, [postId])

  const handleLike = async () => {
    if (!post) return
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ likes_count: (post.likes_count || 0) + 1 })
        .eq('id', post.id)
        
      if (error) {
        console.error('좋아요 업데이트 에러:', error)
        return
      }
      
      // 로컬 상태 업데이트
      setPost({
        ...post,
        likes_count: (post.likes_count || 0) + 1
      })
    } catch (err) {
      console.error('좋아요 처리 중 에러:', err)
    }
  }

  const nextImage = () => {
    if (!post?.image_urls?.length) return
    setCurrentImageIndex((prev) => (prev + 1) % post.image_urls.length)
  }

  const prevImage = () => {
    if (!post?.image_urls?.length) return
    setCurrentImageIndex((prev) => (prev - 1 + post.image_urls.length) % post.image_urls.length)
  }

  if (loading) {
    return (
      <ThemeProvider defaultTheme="dark" attribute="class">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </ThemeProvider>
    )
  }

  if (error || !post) {
    return (
      <ThemeProvider defaultTheme="dark" attribute="class">
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">오류 발생</h2>
            <p className="mb-4">{error || '포스트를 찾을 수 없습니다.'}</p>
            <Button onClick={() => router.back()}>뒤로 가기</Button>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  // 이미지 URL 배열 또는 빈 배열
  const imageUrls = post.image_urls || []
  
  // 태그 배열 또는 빈 배열
  const tags = post.tags || []

  // 포맷된 날짜
  const formattedDate = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // 현재 표시할 이미지
  const currentImage = imageUrls.length > 0 ? imageUrls[currentImageIndex] : null

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <div className="min-h-screen bg-[#121212] text-gray-200">
        <Navigation />
        <CategoryNavigation 
          selectedCategory="" 
          onCategoryChange={() => {}} 
        />

        {/* Main Content */}
        <main className="mx-auto px-0 sm:px-2 md:px-4 lg:px-6 py-2 max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {author?.username?.charAt(0) || 'U'}
                      </div>
                      <span className="text-blue-400">{author?.username || '알 수 없는 사용자'}</span>
                    </div>
                    <span>•</span>
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag: string, index: number) => (
                      <span key={index} className="bg-[#232323] text-gray-300 px-2 py-1 rounded-md text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#232323] text-gray-300 border-gray-700 hover:bg-[#2a2a2a] flex items-center gap-1"
                    onClick={handleLike}
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likes_count || 0}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#232323] text-gray-300 border-gray-700 hover:bg-[#2a2a2a] flex items-center gap-1"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments_count || 0}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#232323] text-gray-300 border-gray-700 hover:bg-[#2a2a2a]"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#232323] text-gray-300 border-gray-700 hover:bg-[#2a2a2a]"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-[#232323] border-gray-700 mb-6 overflow-hidden">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-video w-full">
                    {imageUrls.length > 0 ? (
                      <Image
                        src={imageUrls[currentImageIndex] || ''}
                        alt={`${post.title} - 이미지 ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        unoptimized={imageUrls[currentImageIndex]?.startsWith('http')}
                      />
                    ) : (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-t-lg">
                        <p className="text-muted-foreground">이미지가 없습니다</p>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    
                    {imageUrls.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage} 
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70"
                        >
                          <ArrowLeft className="h-5 w-5 text-white" />
                        </button>
                        <button 
                          onClick={nextImage} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/70 transform rotate-180"
                        >
                          <ArrowLeft className="h-5 w-5 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {post.warning && (
                <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                  <p className="text-red-300">{post.warning}</p>
                </div>
              )}

              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-bold text-white mb-2">
                    단계별 가이드 시리즈:
                    <br />
                    {post.title}
                  </h2>
                  {post.workflow_link && (
                    <p className="text-gray-300 mb-2">
                      이 문서는 다음 워크플로우와 함께 제공됩니다:{" "}
                      <a href={post.workflow_link} className="text-blue-400 hover:underline">
                        링크
                      </a>
                    </p>
                  )}
                </section>

                <section>
                  <h3 className="text-lg font-bold text-white mb-2">본문 내용</h3>
                  <div className="text-gray-300 prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {post.content}
                  </div>
                </section>

                {/* 태그 섹션 */}
                {tags.length > 0 && (
                  <section>
                    <h4 className="text-lg font-semibold text-white mb-2">태그</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag: string, index: number) => (
                        <span key={index} className="bg-[#232323] text-gray-300 px-2 py-1 rounded-md text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* 작성자 정보 카드 */}
                <section>
                  <Card className="bg-[#232323] border-gray-700 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div>
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={author?.avatar_url || ''} />
                            <AvatarFallback>{author?.username?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-lg text-blue-400">{author?.username || '알 수 없는 사용자'}</p>
                          <p className="text-sm text-gray-400 mb-2">가입일: {formattedDate}</p>
                          {author?.bio && <p className="text-sm text-gray-300">{author.bio}</p>}
                        </div>
                        <Button size="sm" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white">
                          팔로우
                        </Button>
                      </div>
                      <div className="flex justify-center gap-4 mt-4">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* 댓글 섹션 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-3">댓글</h3>
                  <div className="text-center text-gray-400 py-6">
                    <p>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
                  </div>
                </section>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-6">
              <Card className="bg-[#232323] border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-white">목차</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setIsTableExpanded(!isTableExpanded)}
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isTableExpanded ? "rotate-180" : ""}`} />
                    </Button>
                  </div>

                  {isTableExpanded && (
                    <nav className="space-y-2 text-sm">
                      {post.warning && (
                        <div className="text-red-400 mb-1">
                          {post.warning}
                        </div>
                      )}
                      <a href="#" className="block text-blue-400 hover:underline">
                        {post.title}
                      </a>
                      <a href="#" className="block text-gray-300 hover:text-blue-400 hover:underline pl-2">
                        소개
                      </a>
                      <a href="#" className="block text-gray-300 hover:text-blue-400 hover:underline pl-2">
                        워크플로우 설명
                      </a>
                      <a href="#" className="block text-gray-300 hover:text-blue-400 hover:underline pl-2">
                        필수 조건
                      </a>
                      <a href="#" className="block text-gray-300 hover:text-blue-400 hover:underline pl-2">
                        단계 1: 설정
                      </a>
                      <a href="#" className="block text-gray-300 hover:text-blue-400 hover:underline pl-2">
                        단계 2: 실행
                      </a>
                    </nav>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#232323] border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                      {author?.username?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-400">{author?.username || '알 수 없는 사용자'}</h3>
                      <p className="text-xs text-gray-400">가입일: {formattedDate}</p>
                    </div>
                    <Button size="sm" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      팔로우
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-[#1a1a1a] rounded-md p-2 text-center">
                      <div className="text-white font-medium">#1</div>
                      <div className="text-xs text-gray-400">포스트</div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-md p-2 text-center">
                      <div className="text-white font-medium">{post.likes_count || 0}</div>
                      <div className="text-xs text-gray-400">좋아요</div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-md p-2 text-center">
                      <div className="text-white font-medium">{author?.followers_count || 0}</div>
                      <div className="text-xs text-gray-400">팔로워</div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
} 
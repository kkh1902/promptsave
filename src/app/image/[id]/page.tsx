"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  X,
  Download,
  Share,
  MoreVertical,
  Copy,
  FlameIcon as Fire,
  Heart,
  MessageCircle,
  Star,
  Info,
  Twitter,
  Globe,
  Bookmark,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Eye as EyeIcon,
  Grid as GridIcon,
  Maximize2,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 유틸리티 함수 - Supabase 연결 확인
const checkSupabaseConnection = async () => {
  try {
    // 간단한 쿼리로 연결 상태 확인
    const { data, error } = await supabase.from('images').select('id').limit(1);
    if (error) {
      console.error("Supabase 연결 오류:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase 연결 확인 중 예외 발생:", err);
    return false;
  }
};

export default function ImageDetailPage() {
  const [showMore, setShowMore] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [viewMode, setViewMode] = useState("single") // "single" or "grid"
  const [slideDirection, setSlideDirection] = useState("") // "left", "right", or ""
  const [isLoading, setIsLoading] = useState(true)
  const [imageData, setImageData] = useState<any>(null)
  const [relatedImages, setRelatedImages] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [retryCount, setRetryCount] = useState(0) // 재시도 횟수 상태 추가

  const params = useParams()
  const router = useRouter()
  const imageId = params.id as string

  // 이미지 데이터 재시도 함수
  const retryFetchImage = () => {
    if (retryCount < 3) { // 최대 3번까지 재시도
      setRetryCount(prev => prev + 1);
      setError(null);
      setIsLoading(true);
    }
  };

  // 이미지 및 관련 데이터 가져오기
  useEffect(() => {
    let isMounted = true;
    
    const fetchImageData = async () => {
      try {
        setIsLoading(true);
        console.log('이미지 ID 확인:', imageId, '재시도:', retryCount);
        
        // Supabase 연결 확인
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          throw new Error('데이터베이스 연결에 실패했습니다. 나중에 다시 시도해주세요.');
        }

        // 기본 이미지 데이터 가져오기
        const { data: image, error: imageError } = await supabase
          .from('images')
          .select('*')
          .eq('id', imageId)
          .single();

        if (imageError) {
          console.error('Supabase 이미지 조회 에러:', imageError); 
          throw new Error(`이미지를 불러오는데 실패했습니다: ${imageError.message}`);
        }

        if (!image) {
          console.error('이미지 데이터 없음:', { imageId });
          throw new Error('해당 ID의 이미지를 찾을 수 없습니다.');
        }

        // 이미지 업로더의 프로필 정보 가져오기 (별도 쿼리)
        let userData = null;
        if (image.user_id) {
          const { data: userProfile, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', image.user_id)
            .single();
            
          if (!userError && userProfile) {
            userData = userProfile;
          } else if (userError) {
            console.log('프로필 정보 조회 실패:', userError);
          }
        }

        if (!isMounted) return;
        
        console.log('불러온 이미지 데이터:', image);
        setImageData({...image, profiles: userData});

        // 관련 이미지 가져오기
        const { data: relatedData, error: relatedError } = await supabase
          .from('images')
          .select('*')
          .eq('category', image.category)
          .neq('id', imageId)
          .limit(5);

        if (relatedError) {
          console.error('관련 이미지 조회 에러:', relatedError);
        }

        if (!isMounted) return;
        
        if (!relatedError && relatedData) {
          setRelatedImages(relatedData);
        }

        // 댓글 가져오기
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('image_id', imageId)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('댓글 조회 에러:', commentsError);
        }

        // 댓글 작성자 프로필 정보 가져오기
        let commentWithProfiles = [];
        if (!commentsError && commentsData && commentsData.length > 0) {
          commentWithProfiles = await Promise.all(
            commentsData.map(async (comment) => {
              if (comment.user_id) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', comment.user_id)
                  .single();
                return { ...comment, profiles: profile || null };
              }
              return { ...comment, profiles: null };
            })
          );
        }

        if (!isMounted) return;
        
        if (!commentsError && commentsData) {
          setComments(commentWithProfiles);
        }

        setIsLoading(false);
        setError(null); // 성공 시 에러 상태 초기화
      } catch (error) {
        if (!isMounted) return;
        
        console.error('데이터 로딩 오류:', error);
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    if (imageId) {
      fetchImageData();
    }
    
    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, [imageId, retryCount]);

  // 이미지 탐색 함수
  const handlePrevImage = () => {
    setSlideDirection("right")
    if (relatedImages.length > 0) {
      setTimeout(() => {
        router.push(`/image/${relatedImages[relatedImages.length - 1].id}`);
      }, 150)
    }
  }

  const handleNextImage = () => {
    setSlideDirection("left")
    if (relatedImages.length > 0) {
      setTimeout(() => {
        router.push(`/image/${relatedImages[0].id}`);
      }, 150)
    }
  }

  // 슬라이드 효과 리셋
  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => {
        setSlideDirection("")
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [slideDirection, selectedImage])

  // 댓글 추가 함수
  const handleAddComment = async () => {
    if (!commentText.trim()) return

    try {
      // 현재 로그인한 사용자 정보 가져오기
      const { data: userData, error: userError } = await supabase.auth.getUser()
      
      if (userError || !userData.user) {
        alert('댓글을 작성하려면 로그인해야 합니다.')
        return
      }

      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            image_id: imageId,
            user_id: userData.user.id,
            content: commentText,
            created_at: new Date().toISOString()
          }
        ])
        .select('*')

      if (error) {
        console.error('댓글 추가 오류:', error)
        return
      }

      if (data) {
        // 새 댓글의 프로필 정보 가져오기
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userData.user.id)
          .single();
          
        const commentWithProfile = { ...data[0], profiles: profile || null };
        setComments([commentWithProfile, ...(comments || [])]);
        setCommentText("");
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error)
    }
  }

  // 로딩 중이거나 오류 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">이미지를 불러오는 중...</div>
      </div>
    )
  }

  if (error || !imageData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || '이미지를 찾을 수 없습니다.'}</div>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={retryFetchImage}
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800"
              disabled={retryCount >= 3 || isLoading}
            >
              {isLoading ? '로딩 중...' : '다시 시도'}
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 이미지 URL이 배열인지 확인하고 처리
  const mainImageUrl = (imageData?.image_urls && Array.isArray(imageData.image_urls) && imageData.image_urls.length > 0)
    ? imageData.image_urls[0]
    : (imageData?.image_urls || imageData?.image_url || "/placeholder.svg");

  // 태그 처리
  const tags = (imageData?.tags && Array.isArray(imageData.tags)) ? imageData.tags : [];

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" className="text-blue-500 hover:text-blue-400 text-sm">
            Remix
          </Button>
          <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 text-sm">
            Save
          </Button>
          <Button
            variant="outline"
            className="text-gray-300 border-gray-700 hover:bg-gray-800 text-sm flex items-center gap-1"
          >
            <EyeIcon className="h-4 w-4" />
            View Post
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/create/image">
            <Button
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800 text-sm flex items-center gap-1 ml-2"
            >
              <Plus className="h-4 w-4" />
              Create Image
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setViewMode(viewMode === "single" ? "grid" : "single")}
          >
            {viewMode === "single" ? <GridIcon className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Download className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-8 flex">
        {/* Image Content */}
        <div className="flex-1 px-4">
          {viewMode === "single" ? (
            <div className="relative flex justify-center items-center min-h-[calc(100vh-8rem)]">
              {/* Left Navigation */}
              {relatedImages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white rounded-full bg-black/30 hover:bg-black/50 z-10"
                  onClick={handlePrevImage}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </Button>
              )}

              {/* Main Image */}
              <div
                className={`relative max-w-3xl mx-auto transition-transform duration-300 ease-in-out ${
                  slideDirection === "left"
                    ? "translate-x-[-20px] opacity-90"
                    : slideDirection === "right"
                      ? "translate-x-[20px] opacity-90"
                      : ""
                }`}
              >
                <Image
                  src={mainImageUrl}
                  alt={imageData.title || "이미지"}
                  width={1200}
                  height={800}
                  className="rounded-lg shadow-2xl"
                  priority
                />
              </div>

              {/* Right Navigation */}
              {relatedImages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white rounded-full bg-black/30 hover:bg-black/50 z-10"
                  onClick={handleNextImage}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              <div
                className="relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ring-2 ring-blue-500"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={mainImageUrl} alt={imageData.title || "이미지"} fill className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-sm line-clamp-2">
                    {imageData.prompt ? imageData.prompt.substring(0, 60) + '...' : '프롬프트 정보 없음'}
                  </p>
                </div>
              </div>
              
              {relatedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-blue-500 hover:scale-[1.02]"
                  onClick={() => router.push(`/image/${image.id}`)}
                >
                  <div className="relative aspect-[4/3]">
                    <Image 
                      src={Array.isArray(image.image_urls) ? image.image_urls[0] : image.image_urls || "/placeholder.svg"} 
                      alt={image.title || "관련 이미지"} 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-sm line-clamp-2">
                      {image.prompt ? image.prompt.substring(0, 60) + '...' : '프롬프트 정보 없음'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Thumbnail Navigation */}
          {viewMode === "single" && relatedImages.length > 0 && (
            <div className="flex justify-center mt-4 gap-2 px-4 overflow-x-auto pb-2">
              <button
                className="relative h-16 w-24 rounded-md overflow-hidden transition-all ring-2 ring-blue-500 scale-105"
              >
                <Image
                  src={mainImageUrl}
                  alt={`현재 이미지`}
                  fill
                  className="object-cover"
                />
              </button>
              
              {relatedImages.map((image, index) => (
                <button
                  key={image.id}
                  className="relative h-16 w-24 rounded-md overflow-hidden transition-all opacity-70 hover:opacity-100 hover:scale-105"
                  onClick={() => router.push(`/image/${image.id}`)}
                >
                  <Image
                    src={Array.isArray(image.image_urls) ? image.image_urls[0] : image.image_urls || "/placeholder.svg"}
                    alt={`썸네일 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-96 border-l border-gray-800 h-screen overflow-y-auto fixed right-0 top-0 pt-16 pb-8">
          <div className={`p-4 transition-transform duration-300 ease-in-out ${
            slideDirection === "left"
              ? "translate-x-[-10px] opacity-90"
              : slideDirection === "right"
                ? "translate-x-[10px] opacity-90"
                : ""
          }`}>
            {/* Navigation buttons for sidebar */}
            {relatedImages.length > 0 && (
              <div className="flex justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-700 hover:bg-gray-800"
                  onClick={handlePrevImage}
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  이전 이미지
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-700 hover:bg-gray-800"
                  onClick={handleNextImage}
                >
                  다음 이미지
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Avatar className="h-10 w-10 border border-gray-700">
                  <AvatarImage src="/avatar-placeholder.jpg" alt="User" />
                  <AvatarFallback>{imageData.profiles?.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                {/* 사용자 레벨 또는 배지 */}
                {imageData.profiles?.level && (
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 text-xs text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {imageData.profiles.level}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white">{imageData.profiles?.username || '익명 사용자'}</h3>
                  <Badge variant="outline" className="text-xs bg-transparent border-blue-500 text-blue-400">
                    <Star className="h-3 w-3 mr-1 fill-blue-400" />
                    Follow
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">
                  {imageData.created_at 
                    ? `업로드: ${new Date(imageData.created_at).toLocaleDateString()}`
                    : '업로드 날짜 정보 없음'}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 mb-6">
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-gray-700 hover:bg-gray-800 hover:text-blue-400">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-gray-700 hover:bg-gray-800 hover:text-green-400">
                <Globe className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-gray-700 hover:bg-gray-800 hover:text-blue-400">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-gray-700 hover:bg-gray-800 hover:text-purple-400">
                <Info className="h-4 w-4" />
              </Button>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-gray-200 transition-all hover:scale-105">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Generation Data */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Generation data
                </h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-400 hover:text-blue-300">
                  <Copy className="h-3 w-3 mr-1" />
                  COPY ALL
                </Button>
              </div>

              {/* Prompt Information */}
              <Card className="bg-gray-900 border-gray-700 mb-4">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-1">
                      Prompt
                      <Badge className="bg-blue-900 text-blue-200 hover:bg-blue-800">TEXTUAL</Badge>
                    </h4>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {showMore 
                      ? imageData.prompt || '프롬프트 정보 없음'
                      : imageData.prompt 
                        ? (imageData.prompt.length > 150 
                          ? imageData.prompt.substring(0, 150) + '...' 
                          : imageData.prompt)
                        : '프롬프트 정보 없음'
                    }
                  </p>
                  {imageData.prompt && imageData.prompt.length > 150 && (
                    <Button
                      variant="link"
                      className="text-xs text-gray-400 hover:text-gray-300 p-0 h-auto mt-1"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? "Show less" : "Show more"}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Negative Prompt Information */}
              {imageData.negative_prompt && (
                <Card className="bg-gray-900 border-gray-700 mb-4">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-300 flex items-center gap-1">
                        Negative Prompt
                      </h4>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {imageData.negative_prompt}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Resources Information */}
              {imageData.resources && imageData.resources.length > 0 && (
                <Card className="bg-gray-900 border-gray-700 mb-4">
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">리소스</h4>
                    <div className="space-y-2">
                      {imageData.resources.map((resource: string, index: number) => (
                        <div key={index} className="text-xs text-gray-300">{resource}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 기타 메타데이터 */}
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-3">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">기타 정보</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-transparent border-gray-600 text-gray-300">
                      카테고리: {imageData.category || 'N/A'}
                    </Badge>
                    {imageData.model && (
                      <Badge variant="outline" className="bg-transparent border-gray-600 text-gray-300">
                        모델: {imageData.model}
                      </Badge>
                    )}
                    {imageData.steps && (
                      <Badge variant="outline" className="bg-transparent border-gray-600 text-gray-300">
                        STEPS: {imageData.steps}
                      </Badge>
                    )}
                    {imageData.seed && (
                      <Badge variant="outline" className="bg-transparent border-gray-600 text-gray-300">
                        SEED: {imageData.seed}
                      </Badge>
                    )}
                    {imageData.tools && imageData.tools.length > 0 && (
                      <Badge variant="outline" className="bg-transparent border-gray-600 text-gray-300">
                        툴: {imageData.tools.join(', ')}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Discussion */}
            <div>
              <h3 className="text-gray-300 mb-3 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                댓글 ({comments?.length || 0})
              </h3>

              <div className="mb-4">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  className="bg-gray-900 border-gray-700 text-gray-200 placeholder:text-gray-500 resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button className="mt-2 w-full" onClick={handleAddComment}>댓글 작성</Button>
              </div>

              <div className="space-y-4">
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage src="/avatar-placeholder.jpg" alt={comment.profiles?.username || '사용자'} />
                        <AvatarFallback>{comment.profiles?.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-gray-900 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-300">{comment.profiles?.username || '익명'}</span>
                            <span className="text-xs text-gray-500">
                              {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-300">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    첫 번째 댓글을 남겨보세요!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 py-3 px-4">
        <div className="flex items-center justify-center gap-6">
          <Button variant="ghost" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
            <Fire className="h-5 w-5" />
            <span>0</span>
          </Button>
          <Button variant="ghost" className="text-red-500 hover:text-red-400 flex items-center gap-1">
            <Heart className="h-5 w-5" />
            <span>0</span>
          </Button>
          <Button variant="ghost" className="text-orange-500 hover:text-orange-400 flex items-center gap-1">
            <MessageCircle className="h-5 w-5" />
            <span>{comments?.length || 0}</span>
          </Button>
          <Button variant="ghost" className="text-blue-500 hover:text-blue-400 flex items-center gap-1">
            <Bookmark className="h-5 w-5" />
            <span>0</span>
          </Button>
          <Button variant="ghost" className="text-purple-500 hover:text-purple-400 flex items-center gap-1">
            <Star className="h-5 w-5" />
            <span>0</span>
          </Button>
        </div>
      </footer>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Share, Download, Heart, MessageCircle, BookmarkIcon, Eye } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePathname, useParams } from 'next/navigation'
import { Navigation } from "@/components/navigation/navigation"
import { CategoryNavigation } from "@/components/category/category-navigation"
import { Footer } from "@/components/footer/footer"
import { AuthorProfileCard } from '@/app/posts/_components/AuthorProfileCard'
import { supabase } from '@/lib/supabase'
import { WorkflowCanvas } from '@/app/images/_components/WorkflowCanvas'

// 이미지 상세 정보 타입 정의 (AuthorProfileCard와 호환되도록 일부 필드명 변경 고려)
interface AuthorDetails {
  id: string
  username: string // name -> username
  avatar_url: string // avatar -> avatar_url
  bio: string
  followers_count: number // followers -> followers_count
  // AuthorProfileCard에서 필요한 추가 필드가 있다면 여기에 추가 (예: created_at)
  created_at?: string
}

interface CommentUser {
  name: string
  avatar: string
}

interface CommentDetails {
  id: string
  user: CommentUser
  text: string
  date: string
}

interface RelatedImage {
  id: string
  thumbnail: string
  title: string
}

interface ImageDetails {
  id: string
  title: string
  description: string
  imageUrl: string
  width: number
  height: number
  uploadDate: string
  views_count: number // views -> views_count
  likes_count: number // likes -> likes_count
  downloads_count: number // downloads -> downloads_count
  tags: string[]
  category: string
  author: AuthorDetails
  comments: CommentDetails[]
  relatedImages: RelatedImage[]
  created_at?: string // 포스트와 유사하게 추가
  comments_count?: number // 포스트와 유사하게 추가
  user_id?: string // AuthorProfileCard에서 필요할 수 있음
  workflow?: object | string | null
  prompt?: string | null
  negative_prompt?: string | null
}

// 기본값 (타입에 맞게 수정)
const dummyImage: ImageDetails = {
  id: '1',
  title: '이미지 로딩 중...',
  description: '',
  imageUrl: '/placeholder-image.jpg',
  width: 1200,
  height: 800,
  uploadDate: '',
  views_count: 0,
  likes_count: 0,
  downloads_count: 0,
  tags: [],
  category: 'other',
  author: {
    id: 'unknown',
    username: '알 수 없음',
    avatar_url: '/placeholder-avatar.jpg',
    bio: '',
    followers_count: 0
  },
  comments: [],
  relatedImages: []
}

const ImageDetailPage = () => {
  const params = useParams()
  const imageId = params.id as string
  
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [imageData, setImageData] = useState<ImageDetails>(dummyImage)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImageDetails() {
      try {
        setLoading(true)
        setError(null)

        // 1. 현재 사용자 정보 가져오기 (옵션)
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        
        // 2. 이미지 정보 가져오기 (workflow 제외, 프롬프트 포함)
        const { data: imageDataRaw, error: imageError } = await supabase
          .from('images') 
          .select('*, prompt, negative_prompt') // workflow 필드 확실히 제거
          .eq('id', imageId)
          .single()
        
        if (imageError) throw imageError
        if (!imageDataRaw) throw new Error('이미지를 찾을 수 없습니다.')
        
        console.log('불러온 이미지 데이터 (프롬프트 제외):', imageDataRaw)
        
        // 3. 작성자 프로필 정보 가져오기 (별도 쿼리)
        let authorData: AuthorDetails = dummyImage.author; // 기본값 설정
        if (imageDataRaw.user_id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', imageDataRaw.user_id)
            .single();
            
          if (profileError) {
            console.error('프로필 정보 가져오기 오류:', profileError);
            // 프로필 로드 실패해도 이미지는 보여줄 수 있도록 에러 처리
          } else if (profileData) {
            authorData = {
              id: profileData.id,
              username: profileData.username || profileData.full_name || '사용자',
              avatar_url: profileData.avatar_url || '/placeholder-avatar.jpg',
              bio: profileData.bio || '',
              followers_count: profileData.followers_count || 0,
              created_at: profileData.created_at
            };
          }
        }
        console.log('불러온 작성자 데이터:', authorData)

        // 4. 데이터 포맷 변환 (workflow 할당 제거)
        const formattedData: ImageDetails = {
          id: imageDataRaw.id,
          title: imageDataRaw.title || '제목 없음',
          description: imageDataRaw.content || '',
          imageUrl: imageDataRaw.url || '/placeholder-image.jpg',
          width: imageDataRaw.width || 1200,
          height: imageDataRaw.height || 800,
          uploadDate: new Date(imageDataRaw.created_at).toLocaleDateString('ko-KR'),
          views_count: imageDataRaw.views_count || 0,
          likes_count: imageDataRaw.likes_count || 0,
          downloads_count: imageDataRaw.downloads_count || 0,
          tags: imageDataRaw.tags || [],
          category: imageDataRaw.category || 'other',
          author: authorData,
          comments: [], // 아래에서 가져옴
          relatedImages: [], // 아래에서 가져옴
          created_at: imageDataRaw.created_at,
          comments_count: imageDataRaw.comments_count || 0,
          user_id: imageDataRaw.user_id,
          prompt: imageDataRaw.prompt, 
          negative_prompt: imageDataRaw.negative_prompt  
        }
        
        // 5. 댓글 가져오기 (변경 없음)
        try {
          const { data: commentsData, error: commentsError } = await supabase
            .from('comments')
            .select(`
              id, 
              content, 
              created_at,
              profiles:user_id (id, username, avatar_url)
            `)
            .eq('image_id', imageId)
            .order('created_at', { ascending: false })
          
          if (!commentsError && commentsData) {
            formattedData.comments = commentsData.map((comment: any) => ({
              id: comment.id,
              user: {
                name: comment.profiles?.username || '사용자',
                avatar: comment.profiles?.avatar_url || '/placeholder-avatar.jpg'
              },
              text: comment.content,
              date: new Date(comment.created_at).toLocaleDateString('ko-KR')
            }))
          }
        } catch (err) {
          console.error('댓글 가져오기 오류:', err)
        }
        
        // 6. 관련 이미지 가져오기 (변경 없음)
        try {
          const { data: relatedData, error: relatedError } = await supabase
            .from('images')
            .select('id, title, url') 
            .neq('id', imageId)
            .eq('category', formattedData.category)
            .limit(4)
          
          if (!relatedError && relatedData) {
            formattedData.relatedImages = relatedData.map(img => ({
              id: img.id,
              thumbnail: img.url,
              title: img.title
            }))
          }
        } catch (err) {
          console.error('관련 이미지 가져오기 오류:', err)
        }
        
        setImageData(formattedData)
        setLoading(false)
        
        // 7. 조회수 증가 (변경 없음)
        supabase
          .from('images')
          .update({ views_count: (imageDataRaw.views_count || 0) + 1 })
          .eq('id', imageId)
          .then(({ error: updateError }) => {
            if (updateError) console.error('조회수 업데이트 에러:', updateError);
          });
        
      } catch (err) {
        console.error('이미지 상세 정보 가져오기 오류:', err)
        console.error('Full error object:', JSON.stringify(err, null, 2)); 
        setError(err instanceof Error && err.message ? err.message : '데이터를 불러오는 중 알 수 없는 오류가 발생했습니다.')
        setLoading(false)
      }
    }
    
    if (imageId) {
      fetchImageDetails()
    }
  }, [imageId])

  const handleLike = async () => {
    if (!currentUserId) {
      // 로그인 필요 알림
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setImageData(prev => ({
        ...prev,
        likes_count: newLikedState ? prev.likes_count + 1 : prev.likes_count - 1
      }));
      
      // TODO: 실제 좋아요/취소 로직 구현 (supabase function 또는 직접 insert/delete)
      // 예시: Supabase 함수 호출
      /*
      const { error } = await supabase.rpc('toggle_like', {
        content_id: imageData.id,
        content_type: 'image',
        user_id: currentUserId
      });
      if (error) throw error;
      */
     // 임시: 직접 업데이트 (실제로는 중복 좋아요 방지 등 필요)
      await supabase
        .from('images')
        .update({ likes_count: imageData.likes_count + (newLikedState ? 1 : -1) })
        .eq('id', imageData.id)
        
    } catch (error) {
      console.error('좋아요 처리 오류:', error)
      // 에러 발생 시 상태 롤백
      setIsLiked(!isLiked);
       setImageData(prev => ({
        ...prev,
        likes_count: isLiked ? prev.likes_count + 1 : prev.likes_count - 1
      }));
    }
  }

  const handleBookmark = () => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      return;
    }
    setIsBookmarked(!isBookmarked)
    // TODO: 실제 북마크 기능 구현
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${pathname}`
    navigator.clipboard.writeText(shareUrl)
    alert('링크가 클립보드에 복사되었습니다!')
  }

  const handleDownload = () => {
    // TODO: 실제 다운로드 로직 구현 (권한 확인, 다운로드 수 증가 등)
    if (imageData.imageUrl) {
      const link = document.createElement('a');
      link.href = imageData.imageUrl; 
      link.download = `${imageData.title || 'image'}.jpg`; // 파일명 설정
      // CORS 문제가 없는 경우 직접 다운로드 시도
      // link.target = '_blank'; // 새 탭에서 열기 (선택 사항)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 다운로드 수 증가 (백엔드 로직 필요)
      supabase
        .from('images')
        .update({ downloads_count: (imageData.downloads_count || 0) + 1 })
        .eq('id', imageData.id)
        .then(({ error: updateError }) => {
            if (updateError) console.error('다운로드 수 업데이트 에러:', updateError);
        });
      setImageData(prev => ({ ...prev, downloads_count: prev.downloads_count + 1 }));

    } else {
      alert('다운로드할 이미지 URL이 없습니다.');
    }
  }
  
  const isOwner = currentUserId === imageData.user_id;

  // TODO: 이미지 삭제 함수 구현
  const handleDeleteImage = async () => {
    if (!isOwner) return;
    if (window.confirm("정말 이 이미지를 삭제하시겠습니까?")) {
      // ... 삭제 로직 ...
      alert('삭제 기능 구현 필요');
    }
  }

  // TODO: 이미지 수정 페이지 이동 함수 구현
  const handleEditImage = () => {
    if (!isOwner) return;
    // router.push(`/images/${imageData.id}/edit`);
    alert('수정 기능 구현 필요');
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navigation />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">이미지를 불러오는 중...</p>
        </div>
        <Footer /> 
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-xl font-bold text-red-500 mb-4">{error}</h1>
            <Button asChild className="mt-4">
              <Link href="/">메인으로 돌아가기</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CategoryNavigation 
        selectedCategory={imageData.category}
        onCategoryChange={() => {}} // 필요 시 카테고리 변경 로직 추가
        type="image"
      />
      
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1280px] w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* === Left Column: Main Content === */}
          <div className="lg:w-2/3 space-y-6">
            {/* === 메인 이미지 === */}
            <Card className="overflow-hidden">
              <CardContent className="p-0 aspect-[16/10] relative bg-black flex items-center justify-center">
                <Image
                  src={imageData.imageUrl}
                  alt={imageData.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </CardContent>
            </Card>
            
            {/* === 이미지 제목 및 액션 === */}
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl md:text-3xl font-bold flex-1">{imageData.title}</h1>
              {/* TODO: PostActions 같은 컴포넌트 분리 고려 */} 
              <div className="flex items-center gap-2">
                {/* 수정/삭제 버튼 (소유자만) */}
                {isOwner && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleEditImage}>수정</Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteImage}>삭제</Button>
                  </>
                )}
              </div>
            </div>

            {/* === 이미지 통계 정보 === */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground border-y py-3">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" /> {imageData.views_count}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" /> {imageData.likes_count}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" /> {imageData.comments_count}
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" /> {imageData.downloads_count}
              </div>
              <span className="ml-auto">{imageData.uploadDate}</span>
            </div>
            
            {/* === 워크플로우 및 설명 카드 === */}
            <Card>
              <CardContent className="p-4 md:p-6 space-y-4">
                {/* === 워크플로우 캔버스 (항상 렌더링) === */} 
                <div className="border rounded-lg overflow-hidden">
                  <WorkflowCanvas workflowData={imageData.workflow} />
                </div>
                {/* === 이미지 설명 === */} 
                {imageData.description && (
                  <div className="prose dark:prose-invert max-w-none pt-4">
                    <p>{imageData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* === 이미지 태그 === */}
            {imageData.tags && imageData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {imageData.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            
            {/* Comments Section */}
            <div className="pt-8">
              <h2 className="text-xl font-bold mb-4">댓글 ({imageData.comments.length})</h2>
              {/* TODO: 댓글 작성 컴포넌트 분리 */} 
              <div className="flex items-start space-x-4 mb-6">
                 <Avatar className="mt-1">
                   {/* TODO: 로그인 사용자 아바타 */}
                   <AvatarFallback>ME</AvatarFallback>
                 </Avatar>
                 <div className="flex-1">
                   <textarea 
                     className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 mb-2"
                     placeholder="댓글을 작성해주세요..."
                     rows={3}
                   />
                   <Button size="sm">댓글 작성</Button>
                 </div>
               </div>
               
              {/* Comment List */}
              <div className="space-y-6">
                {imageData.comments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
                {imageData.comments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">작성된 댓글이 없습니다.</p>
                )}
              </div>
            </div>
          </div>

          {/* === Right Column: Sidebar === */}
          <div className="lg:w-1/3 space-y-6 lg:sticky lg:top-20 self-start">
             {/* Action Buttons Card */} 
            <Card>
              <CardContent className="p-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleLike} className={`flex-1 min-w-[45%] ${isLiked ? 'text-red-500 border-red-500' : ''}`}>
                  <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  좋아요 ({imageData.likes_count})
                </Button>
                <Button variant="outline" onClick={handleBookmark} className={`flex-1 min-w-[45%] ${isBookmarked ? 'text-blue-500 border-blue-500' : ''}`}>
                  <BookmarkIcon className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  저장
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex-1 min-w-[45%]">
                  <Share className="mr-2 h-4 w-4" />
                  공유
                </Button>
                <Button variant="default" onClick={handleDownload} className="flex-1 min-w-[45%]">
                  <Download className="mr-2 h-4 w-4" />
                  다운로드 ({imageData.downloads_count})
                </Button>
              </CardContent>
            </Card>
          
            {/* Author Info Card */}
            <AuthorProfileCard 
              author={imageData.author} 
              post={{ likes_count: imageData.likes_count }} // 필요한 post 정보만 전달
            />
            
            {/* Prompt Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">프롬프트 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {(!imageData.prompt && !imageData.negative_prompt) ? (
                  <p className="text-muted-foreground text-center py-4">프롬프트 정보가 없습니다.</p>
                ) : (
                  <>
                    {imageData.prompt && (
                      <div>
                        <h4 className="font-medium mb-1">Prompt</h4>
                        <pre className="whitespace-pre-wrap break-words bg-muted p-3 rounded-md max-h-40 overflow-y-auto text-muted-foreground font-sans">
                          {imageData.prompt}
                        </pre>
                      </div>
                    )}
                    {imageData.negative_prompt && (
                      <div>
                        <h4 className="font-medium mb-1">Negative Prompt</h4>
                        <pre className="whitespace-pre-wrap break-words bg-muted p-3 rounded-md max-h-40 overflow-y-auto text-muted-foreground font-sans">
                          {imageData.negative_prompt}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Image Metadata Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">이미지 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">업로드</span>
                  <span>{imageData.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">해상도</span>
                  <span>{imageData.width} x {imageData.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">조회수</span>
                  <span>{imageData.views_count}</span>
                </div>
                 {/* 다운로드 수는 액션 버튼에 표시됨 */}
              </CardContent>
            </Card>
            
            {/* Related Images Card */}
            {imageData.relatedImages && imageData.relatedImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">관련 이미지</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  {imageData.relatedImages.map(img => (
                    <Link href={`/images/${img.id}`} key={img.id}>
                      <div className="group relative aspect-square rounded-md overflow-hidden border">
                        <Image
                          src={img.thumbnail}
                          alt={img.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="150px"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-medium line-clamp-1">{img.title}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default ImageDetailPage 
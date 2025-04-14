"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Eye, MessageSquare, Star, MoreVertical, Download, ThumbsUp, MoreHorizontal, ChevronDown, Share2, ExternalLink, Copy } from "lucide-react"
import { createClient } from '@supabase/supabase-js'
import MDEditor from '@uiw/react-md-editor'
import ReactMarkdown from 'react-markdown'

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
  const [tableOfContents, setTableOfContents] = useState<{id: string, title: string, level: number}[]>([])
  const contentRef = useRef<HTMLDivElement>(null);

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

  // 마크다운에서 헤더를 추출하여 목차 생성
  useEffect(() => {
    if (post?.content) {
      const headerRegex = /^(#{1,6})\s+(.+)$/gm;
      const matches = [...post.content.matchAll(headerRegex)];
      
      const toc = matches.map((match, index) => {
        const level = match[1].length; // # 개수로 레벨 판단
        const title = match[2].trim();
        const id = `header-${index}-${title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
        return { id, title, level };
      });
      
      setTableOfContents(toc);
    }
  }, [post?.content]);

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

  // 마크다운 내용에 헤더 ID 추가
  const addIdsToHeadings = (markdown: string) => {
    if (!markdown) return markdown;
    
    // 모든 헤더를 찾아서 ID 부여
    return markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
      const level = hashes.length;
      const id = `header-${title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
      return `${hashes} ${title} {#${id}}`;
    });
  };

  // 스크롤 이동 함수 개선 - 하이라이트 효과 제거
  const scrollToHeader = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (contentRef.current) {
      const element = contentRef.current.querySelector(`#${id}`);
      
      if (element) {
        // 현재 스크롤 위치
        const startPosition = window.pageYOffset;
        // 타겟 요소의 위치 (헤더 상단 여백 80px 적용)
        const targetPosition = (element as HTMLElement).getBoundingClientRect().top + window.pageYOffset - 80;
        // 이동할 거리
        const distance = targetPosition - startPosition;
        
        // 스크롤 애니메이션 설정
        const duration = 800; // 애니메이션 지속 시간 (ms)
        let start: number | null = null;
        
        // 애니메이션 함수
        function step(timestamp: number) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percentage = Math.min(progress / duration, 1);
          
          // 이징 함수 적용 (easeInOutQuad)
          const easing = percentage < 0.5
            ? 2 * percentage * percentage
            : 1 - Math.pow(-2 * percentage + 2, 2) / 2;
          
          window.scrollTo(0, startPosition + distance * easing);
          
          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }
        
        // 애니메이션 시작
        window.requestAnimationFrame(step);
      } else {
        console.error(`Element with id ${id} not found`);
      }
    }
  };

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
        <main className="mx-auto px-0 sm:px-1 md:px-2 lg:px-3 py-1 max-w-[1280px] w-full">
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Main Content - 비율 줄임 */}
            <div className="flex-[2]">
              <div className="mb-4 flex items-start justify-between">
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

              <Card className="bg-[#232323] border-gray-700 mb-4 overflow-hidden">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-[16/6] w-full">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={`${post.title} - 커버 이미지`}
                        fill
                        className="object-cover"
                        unoptimized={post.cover_image_url?.startsWith('http')}
                      />
                    ) : imageUrls.length > 0 ? (
                      <Image
                        src={imageUrls[0] || ''}
                        alt={`${post.title} - 이미지`}
                        fill
                        className="object-cover"
                        unoptimized={imageUrls[0]?.startsWith('http')}
                      />
                    ) : (
                      <div className="aspect-[16/6] bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-t-lg">
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
                  <div data-color-mode="dark" className="markdown-content prose prose-invert max-w-none" ref={contentRef}>
                    <ReactMarkdown 
                      components={{
                        h1: ({node, ...props}) => {
                          const id = `header-${String(props.children || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                          return <h1 id={id} className="text-2xl font-bold mt-6 mb-4" {...props} />;
                        },
                        h2: ({node, ...props}) => {
                          const id = `header-${String(props.children || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                          return <h2 id={id} className="text-xl font-bold mt-5 mb-3" {...props} />;
                        },
                        h3: ({node, ...props}) => {
                          const id = `header-${String(props.children || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                          return <h3 id={id} className="text-lg font-bold mt-4 mb-2" {...props} />;
                        },
                        h4: ({node, ...props}) => {
                          const id = `header-${String(props.children || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                          return <h4 id={id} className="text-base font-bold mt-4 mb-2" {...props} />;
                        },
                        h5: ({node, ...props}) => {
                          const id = `header-${String(props.children || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                          return <h5 id={id} className="text-sm font-bold mt-3 mb-1" {...props} />;
                        },
                        h6: ({node, ...props}) => {
                          const id = `header-${String(props.children || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                          return <h6 id={id} className="text-xs font-bold mt-3 mb-1" {...props} />;
                        },
                        img: ({node, ...props}) => {
                          return <img className="max-w-full rounded-lg my-4" {...props} alt={props.alt || 'Image'} />;
                        },
                        a: ({node, ...props}) => {
                          return <a className="text-blue-400 hover:underline" {...props} target="_blank" rel="noopener noreferrer" />;
                        },
                        code: ({node, className, children, ...props}: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match && (children?.toString()?.split('\n')?.length || 0) <= 1;
                          
                          if (isInline) {
                            return <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm" {...props} />;
                          }
                          return <code className="block bg-gray-800 p-4 rounded-md text-sm overflow-x-auto my-4" {...props} />;
                        },
                        pre: ({node, ...props}) => {
                          return <pre className="bg-transparent p-0 m-0" {...props} />;
                        },
                        blockquote: ({node, ...props}) => {
                          return <blockquote className="border-l-4 border-blue-500 pl-4 italic py-1 my-4" {...props} />;
                        },
                        ul: ({node, ...props}) => {
                          return <ul className="list-disc pl-6 my-4 space-y-2" {...props} />;
                        },
                        ol: ({node, ...props}) => {
                          return <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />;
                        },
                        table: ({node, ...props}) => {
                          return <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse" {...props} /></div>;
                        },
                        th: ({node, ...props}) => {
                          return <th className="border border-gray-700 px-4 py-2 bg-gray-800 text-left" {...props} />;
                        },
                        td: ({node, ...props}) => {
                          return <td className="border border-gray-700 px-4 py-2" {...props} />;
                        }
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
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

                

                {/* 댓글 섹션 */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-3">댓글</h3>
                  <div className="text-center text-gray-400 py-6">
                    <p>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
                  </div>
                </section>
              </div>
            </div>

            {/* Sidebar - 고정 상태로 스크롤 */}
            <div 
              className="w-full lg:w-[400px] flex-[1] lg:sticky lg:top-20 lg:self-start"
              style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
            >
              <div className="space-y-4 flex flex-col">
                <Card className="bg-[#1a1a1a] border-gray-700 rounded-xl overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3 className="font-semibold text-white text-sm">Table of Contents</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white h-6 w-6 p-0"
                        onClick={() => setIsTableExpanded(!isTableExpanded)}
                      >
                        <ChevronDown className={`h-3 w-3 transition-transform ${isTableExpanded ? "rotate-180" : ""}`} />
                      </Button>
                    </div>

                    {isTableExpanded && (
                      <nav className="space-y-1 text-xs max-h-[25vh] overflow-y-auto pr-2 custom-scrollbar">
                        {post.warning && (
                          <div className="text-red-400 mb-1 p-1.5 bg-red-900/20 rounded-lg text-xs">
                            {post.warning}
                          </div>
                        )}
                        
                        {/* 특별 항목 - 최상단 */}
                        <a 
                          href="#" 
                          className="block text-white font-medium hover:bg-[#172136] p-1.5 rounded-lg bg-[#1d2c48] border-l-4 border-blue-500"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🔪✨</span>
                            <span className="truncate">I KILLED CIVBOT</span>
                          </div>
                        </a>
                        
                        {tableOfContents.length > 0 ? (
                          tableOfContents.map((item, index) => {
                            // 레벨에 따라 적절한 이모지 선택
                            let emoji = "📝";
                            if (item.title.toLowerCase().includes("what")) emoji = "💭";
                            if (item.title.toLowerCase().includes("why")) emoji = "📋";
                            if (item.title.toLowerCase().includes("monetization")) emoji = "🎁";
                            if (item.title.toLowerCase().includes("now")) emoji = "❤️";
                            
                            // ID 생성 - 위에서 만든 헤더 ID와 일치하게 수정
                            const headerId = `header-${item.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                            
                            return (
                              <a 
                                key={index} 
                                href={`#${headerId}`}
                                onClick={(e) => scrollToHeader(headerId, e)}
                                className={`block text-gray-200 hover:bg-[#172136] p-2 rounded-lg ${
                                  item.level === 1 ? 'font-medium' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-base">{emoji}</span>
                                  <span className="truncate">{item.title}</span>
                                </div>
                              </a>
                            );
                          })
                        ) : (
                          <div className="text-gray-400 p-2">목차를 생성할 수 없습니다.</div>
                        )}
                      </nav>
                    )}
                  </CardContent>
                </Card>

                {/* 프로필 카드 - 더 작게 */}
                <Card className="bg-[#1a1a1a] border-gray-700 rounded-xl overflow-hidden">
                  <CardContent className="p-0">
                    {/* 커버 이미지 */}
                    <div className="relative h-16 w-full bg-gradient-to-r from-blue-900 to-purple-900">
                      {post.cover_image_url && (
                        <Image
                          src={post.cover_image_url}
                          alt="Profile cover"
                          fill
                          className="object-cover opacity-40"
                          unoptimized={post.cover_image_url?.startsWith('http')}
                        />
                      )}
                    </div>
                    
                    {/* 프로필 정보 */}
                    <div className="p-3 relative">
                      {/* 프로필 이미지 - 커버 이미지와 겹치게 */}
                      <div className="absolute -top-8 left-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-base font-medium border-2 border-[#1a1a1a] overflow-hidden">
                          {author?.avatar_url ? (
                            <Image
                              src={author.avatar_url}
                              alt={author?.username || 'User'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            author?.username?.charAt(0) || 'U'
                          )}
                        </div>
                      </div>
                      
                      {/* 유저 정보 */}
                      <div className="mt-4 pt-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-base text-white">{author?.username || '알 수 없는 사용자'}</h3>
                            <p className="text-gray-400 text-xs">Joined {formattedDate}</p>
                          </div>
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-3 py-0 h-7 text-xs">
                            Follow
                          </Button>
                        </div>
                        
                        {author?.bio && (
                          <p className="text-gray-300 my-2 text-xs line-clamp-2">{author.bio}</p>
                        )}
                        
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div className="text-center">
                            <div className="text-white font-medium text-sm">#1</div>
                            <div className="text-xs text-gray-400">Posts</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-medium text-sm">{post.likes_count || 0}</div>
                            <div className="text-xs text-gray-400">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white font-medium text-sm">{author?.followers_count || 0}</div>
                            <div className="text-xs text-gray-400">Followers</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* 스크롤 효과용 글로벌 스타일 추가 - 하이라이트 부분 제거 */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1a1a1a;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #2d3748;
            border-radius: 5px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #4a5568;
          }
        `}</style>
      </div>
    </ThemeProvider>
  )
} 
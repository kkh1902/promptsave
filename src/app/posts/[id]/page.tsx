"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Eye, MessageSquare, Star, MoreVertical, Download, ThumbsUp, MoreHorizontal, ChevronDown, Share2, ExternalLink, Copy } from "lucide-react"
import { createClient } from '@supabase/supabase-js'
import MDEditor from '@uiw/react-md-editor'
import ReactMarkdown from 'react-markdown'
import { formatDistanceToNow } from 'date-fns'
import React from 'react'
import { toast } from 'sonner'

import { Navigation } from "@/components/navigation/navigation"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Banner } from "@/components/banner/banner"
import { CategoryNavigation } from "@/components/category/category-navigation"
import { Footer } from "@/components/footer/footer"
import { AuthorProfileCard } from '../_components/AuthorProfileCard'
import { TableOfContentsCard } from '../_components/TableOfContentsCard'
import { CoverImageCard } from '../_components/CoverImageCard'
import { PostActions } from '../_components/PostActions'

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
  const [tableOfContents, setTableOfContents] = useState<{id: string, title: string, level: number}[]>([])
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. 현재 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        // 2. 포스트 데이터 가져오기
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (postError) throw new Error('포스트를 찾을 수 없습니다.');
        setPost(postData);

        // 3. 조회수 증가 (비동기 처리, 실패해도 진행)
        supabase
          .from('posts')
          .update({ views_count: (postData.views_count || 0) + 1 })
          .eq('id', postId)
          .then(({ error: updateError }) => {
            if (updateError) console.error('조회수 업데이트 에러:', updateError);
          });

        // 4. 작성자 정보 가져오기
        if (postData.user_id) {
          const { data: authorData, error: authorError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', postData.user_id)
            .single();
          if (authorError) console.error('작성자 정보 조회 에러:', authorError);
          setAuthor(authorData);
        } else {
          setAuthor(null); // 작성자 ID가 없는 경우 author 상태 초기화
        }

      } catch (err) {
        console.error('포스트 로드 중 에러:', err);
        setError(err instanceof Error ? err.message : '포스트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchInitialData();
    }
  }, [postId]);

  useEffect(() => {
    if (post?.content) {
      const headerRegex = /^(#{1,6})\s+(.+)$/gm;
      const matches = [...post.content.matchAll(headerRegex)];
      
      const toc = matches.map((match, index) => {
        const level = match[1].length;
        const title = match[2].trim();
        const id = `header-${title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
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

  const addIdsToHeadings = (markdown: string) => {
    if (!markdown) return markdown;
    
    return markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
      const level = hashes.length;
      const id = `header-${title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
      return `${hashes} ${title} {#${id}}`;
    });
  };

  const scrollToHeader = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (contentRef.current) {
      const element = contentRef.current.querySelector(`#${id}`);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.scrollBy(0, -80);
        
        element.classList.add('highlight-header');
        setTimeout(() => {
          element.classList.remove('highlight-header');
        }, 2000);
      } else {
        console.warn(`TOC Scroll Error: Element with id '${id}' not found within contentRef.`); 
      }
    }
  };

  const handleDeletePost = async () => {
    if (!postId || !currentUserId || currentUserId !== author?.id) {
      toast.error('삭제 권한이 없습니다.');
      return;
    }

    setLoading(true);
    try {
      if (post?.image_urls && post.image_urls.length > 0) {
        const filePaths = post.image_urls.map((url: string) => {
           try {
             const urlParts = url.split('/posts/'); 
             return urlParts[1] || null;
           } catch (e) {
             console.warn("Could not parse file path from URL:", url);
             return null;
           }
        }).filter((path: string | null) => path !== null) as string[];
        
        if (filePaths.length > 0) {
            console.log("Deleting storage objects:", filePaths);
            const { error: storageError } = await supabase.storage
              .from('posts')
              .remove(filePaths);
              
            if (storageError) {
                console.error('Storage 삭제 에러:', storageError);
                toast.warning('게시물 이미지를 삭제하는 중 오류가 발생했습니다. DB 데이터만 삭제될 수 있습니다.');
            }
        }
      }

      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success('게시물이 성공적으로 삭제되었습니다.');
      router.push('/');
      router.refresh();

    } catch (err: any) {
      console.error('게시물 삭제 오류:', err);
      toast.error(`삭제 실패: ${err.message || '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setLoading(false);
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

  const imageUrls = post.image_urls || []
  const tags = post.tags || []

  const formattedDate = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const displayImageUrl = post.cover_image_url || (imageUrls.length > 0 ? imageUrls[0] : null)

  const comments = []; 

  const currentUser = null;

  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <div className="min-h-screen bg-[#121212] text-gray-200">
        <Navigation />
        <CategoryNavigation 
          selectedCategory={post.category}
          onCategoryChange={() => {}} 
        />

        <main className="mx-auto px-0 sm:px-1 md:px-2 lg:px-3 py-1 max-w-[1280px] w-full">
          <div className="mb-8">
            <div className="flex items-start justify-between">
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
              <PostActions 
                postId={post.id} 
                likeCount={post.likes_count || 0}
                commentCount={post.comments_count || 0}
                authorId={author?.id}
                currentUserId={currentUserId}
                onLike={handleLike} 
                onDelete={handleDeletePost}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:flex-1 space-y-6">
              <CoverImageCard 
                imageUrl={displayImageUrl} 
                altText={`${post.title} - 이미지`}
              />

              {post.warning && (
                <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r">
                  <p className="text-red-300">{post.warning}</p>
                </div>
              )}

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
                        const titleText = React.Children.toArray(props.children).join('');
                        const id = `header-${titleText.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                        return <h1 id={id} className="text-2xl font-bold mt-6 mb-4 scroll-mt-20" {...props} />;
                      },
                      h2: ({node, ...props}) => {
                        const titleText = React.Children.toArray(props.children).join('');
                        const id = `header-${titleText.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                        return <h2 id={id} className="text-xl font-bold mt-5 mb-3 scroll-mt-20" {...props} />;
                      },
                      h3: ({node, ...props}) => {
                        const titleText = React.Children.toArray(props.children).join('');
                        const id = `header-${titleText.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                        return <h3 id={id} className="text-lg font-bold mt-4 mb-2 scroll-mt-20" {...props} />;
                      },
                      h4: ({node, ...props}) => {
                        const titleText = React.Children.toArray(props.children).join('');
                        const id = `header-${titleText.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                        return <h4 id={id} className="text-base font-bold mt-4 mb-2 scroll-mt-20" {...props} />;
                      },
                      h5: ({node, ...props}) => {
                        const titleText = React.Children.toArray(props.children).join('');
                        const id = `header-${titleText.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                        return <h5 id={id} className="text-sm font-bold mt-3 mb-1 scroll-mt-20" {...props} />;
                      },
                      h6: ({node, ...props}) => {
                        const titleText = React.Children.toArray(props.children).join('');
                        const id = `header-${titleText.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`;
                        return <h6 id={id} className="text-xs font-bold mt-3 mb-1 scroll-mt-20" {...props} />;
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

              <section>
                <h3 className="text-xl font-bold text-white mb-3">댓글</h3>
                <div className="text-center text-gray-400 py-6">
                  <p>아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</p>
                </div>
              </section>
            </div>

            <div className="w-full lg:w-[400px] lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
              <div className="space-y-4 h-full flex flex-col">
                <TableOfContentsCard 
                  tableOfContents={tableOfContents} 
                  warning={post.warning} 
                  onScrollToHeader={scrollToHeader} 
                />
                <AuthorProfileCard author={author} post={post} />
              </div>
            </div>
          </div>
        </main>

        <Footer />

        <style jsx global>{`
          .highlight-header {
            animation: highlight-fade 2s ease-out;
          }
          
          @keyframes highlight-fade {
            0% { background-color: rgba(59, 130, 246, 0.2); }
            100% { background-color: transparent; }
          }
          
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
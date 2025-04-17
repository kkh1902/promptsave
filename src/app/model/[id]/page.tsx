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
  Code,
  GitFork,
  FileText,
  ExternalLink,
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
    const { data, error } = await supabase.from('ai_models').select('id').limit(1);
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

export default function ModelDetailPage() {
  const [showMore, setShowMore] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overview") // "overview", "examples", "docs"
  const [slideDirection, setSlideDirection] = useState("") // "left", "right", or ""
  const [isLoading, setIsLoading] = useState(true)
  const [modelData, setModelData] = useState<any>(null)
  const [relatedModels, setRelatedModels] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [retryCount, setRetryCount] = useState(0) // 재시도 횟수 상태 추가

  const params = useParams()
  const router = useRouter()
  const modelId = params.id as string

  // 모델 데이터 재시도 함수
  const retryFetchModel = () => {
    if (retryCount < 3) { // 최대 3번까지 재시도
      setRetryCount(prev => prev + 1);
      setError(null);
      setIsLoading(true);
    }
  };

  // 모델 및 관련 데이터 가져오기
  useEffect(() => {
    let isMounted = true;
    
    const fetchModelData = async () => {
      try {
        setIsLoading(true);
        console.log('모델 ID 확인:', modelId, '재시도:', retryCount);
        
        // Supabase 연결 확인
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          throw new Error('데이터베이스 연결에 실패했습니다. 나중에 다시 시도해주세요.');
        }

        // 기본 모델 데이터 가져오기
        const { data: model, error: modelError } = await supabase
          .from('ai_models')
          .select('*')
          .eq('id', modelId)
          .single();

        if (modelError) {
          console.error('Supabase 모델 조회 에러:', modelError); 
          throw new Error(`모델을 불러오는데 실패했습니다: ${modelError.message}`);
        }

        if (!model) {
          console.error('모델 데이터 없음:', { modelId });
          throw new Error('해당 ID의 모델을 찾을 수 없습니다.');
        }

        // 모델 업로더의 프로필 정보 가져오기 (별도 쿼리)
        let userData = null;
        if (model.user_id) {
          const { data: userProfile, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', model.user_id)
            .single();
            
          if (!userError && userProfile) {
            userData = userProfile;
          } else if (userError) {
            console.log('프로필 정보 조회 실패:', userError);
          }
        }

        if (!isMounted) return;
        
        console.log('불러온 모델 데이터:', model);
        setModelData({...model, profiles: userData});

        // 관련 모델 가져오기
        const { data: relatedData, error: relatedError } = await supabase
          .from('ai_models')
          .select('*')
          .eq('category', model.category)
          .neq('id', modelId)
          .limit(5);

        if (relatedError) {
          console.error('관련 모델 조회 에러:', relatedError);
        }

        if (!isMounted) return;
        
        if (!relatedError && relatedData) {
          setRelatedModels(relatedData);
        }

        // 댓글 가져오기
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('model_id', modelId)
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

    if (modelId) {
      fetchModelData();
    }
    
    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, [modelId, retryCount]);

  // 모델 탐색 함수
  const handlePrevModel = () => {
    setSlideDirection("right")
    if (relatedModels.length > 0) {
      setTimeout(() => {
        router.push(`/model/${relatedModels[relatedModels.length - 1].id}`);
      }, 150)
    }
  }

  const handleNextModel = () => {
    setSlideDirection("left")
    if (relatedModels.length > 0) {
      setTimeout(() => {
        router.push(`/model/${relatedModels[0].id}`);
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
  }, [slideDirection])

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
            model_id: modelId,
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
        <div className="text-gray-400">모델 정보를 불러오는 중...</div>
      </div>
    )
  }

  if (error || !modelData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || '모델을 찾을 수 없습니다.'}</div>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={retryFetchModel}
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800"
              disabled={retryCount >= 3 || isLoading}
            >
              {isLoading ? '로딩 중...' : '다시 시도'}
            </Button>
            <Button 
              onClick={() => router.push('/models')}
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              모델 목록으로
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 이미지 URL이 배열인지 확인하고 처리
  const modelImageUrl = (modelData?.image_urls && Array.isArray(modelData.image_urls) && modelData.image_urls.length > 0)
    ? modelData.image_urls[0]
    : (modelData?.image_urls || modelData?.image_url || "/placeholder.svg");

  // 태그 처리
  const tags = (modelData?.tags && Array.isArray(modelData.tags)) ? modelData.tags : [];

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/models">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" className="text-blue-500 hover:text-blue-400 text-sm">
            Fork
          </Button>
          <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 text-sm">
            Save
          </Button>
          <Button
            variant="outline"
            className="text-gray-300 border-gray-700 hover:bg-gray-800 text-sm flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/create/model">
            <Button
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800 text-sm flex items-center gap-1 ml-2"
            >
              <Plus className="h-4 w-4" />
              Add Model
            </Button>
          </Link>
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
        {/* Model Content */}
        <div className="flex-1 px-4">
          <div className="relative flex justify-center items-start min-h-[calc(100vh-16rem)]">
            {/* Model Info */}
            <div className={`w-full max-w-4xl mx-auto transition-transform duration-300 ease-in-out ${
              slideDirection === "left"
                ? "translate-x-[-20px] opacity-90"
                : slideDirection === "right"
                  ? "translate-x-[20px] opacity-90"
                  : ""
            }`}>
              {/* Model Header */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-64 flex-shrink-0">
                  <div className="rounded-lg overflow-hidden bg-gray-800 aspect-square relative">
                    <Image
                      src={modelImageUrl}
                      alt={modelData.title || "모델 이미지"}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{modelData.title}</h1>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Heart className="h-5 w-5 mr-1" />
                        <span>{modelData.likes_count || 0}</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage src="/avatar-placeholder.jpg" alt="User" />
                        <AvatarFallback>{modelData.profiles?.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-white">{modelData.profiles?.username || '익명 사용자'}</h3>
                        <Badge variant="outline" className="text-xs bg-transparent border-blue-500 text-blue-400">
                          <Star className="h-3 w-3 mr-1 fill-blue-400" />
                          Follow
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-300 mb-4">
                    {modelData.description || '모델 설명 없음'}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-gray-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-gray-800 rounded-md p-3">
                      <div className="text-xs text-gray-400">버전</div>
                      <div className="text-gray-200 font-medium">{modelData.version || "1.0.0"}</div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3">
                      <div className="text-xs text-gray-400">라이선스</div>
                      <div className="text-gray-200 font-medium">{modelData.license || "MIT"}</div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3">
                      <div className="text-xs text-gray-400">등록일</div>
                      <div className="text-gray-200 font-medium">
                        {modelData.created_at 
                          ? new Date(modelData.created_at).toLocaleDateString()
                          : '날짜 정보 없음'}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-md p-3">
                      <div className="text-xs text-gray-400">다운로드</div>
                      <div className="text-gray-200 font-medium">{modelData.downloads_count || 0}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Download className="h-4 w-4 mr-2" />
                      모델 다운로드
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      <Code className="h-4 w-4 mr-2" />
                      코드 보기
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      <GitFork className="h-4 w-4 mr-2" />
                      Fork
                    </Button>
                    {modelData.repo_url && (
                      <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" asChild>
                        <Link href={modelData.repo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Repository
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-700 mb-6">
                <div className="flex gap-4">
                  <button
                    className={`py-2 px-1 relative ${selectedTab === "overview" ? "text-white" : "text-gray-400 hover:text-gray-300"}`}
                    onClick={() => setSelectedTab("overview")}
                  >
                    개요
                    {selectedTab === "overview" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                    )}
                  </button>
                  <button
                    className={`py-2 px-1 relative ${selectedTab === "examples" ? "text-white" : "text-gray-400 hover:text-gray-300"}`}
                    onClick={() => setSelectedTab("examples")}
                  >
                    사용 예시
                    {selectedTab === "examples" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                    )}
                  </button>
                  <button
                    className={`py-2 px-1 relative ${selectedTab === "docs" ? "text-white" : "text-gray-400 hover:text-gray-300"}`}
                    onClick={() => setSelectedTab("docs")}
                  >
                    문서
                    {selectedTab === "docs" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="mb-8">
                {selectedTab === "overview" && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">모델 소개</h2>
                    <div className="text-gray-300 whitespace-pre-line">
                      {modelData.content || "모델에 대한 자세한 설명이 없습니다."}
                    </div>
                    
                    {modelData.features && (
                      <div className="mt-6">
                        <h3 className="text-lg font-bold mb-3">주요 기능</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-300">
                          {modelData.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {modelData.requirements && (
                      <div className="mt-6">
                        <h3 className="text-lg font-bold mb-3">요구사항</h3>
                        <Card className="bg-gray-900 border-gray-700">
                          <CardContent className="p-4">
                            <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                              {modelData.requirements}
                            </pre>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedTab === "examples" && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">사용 예시</h2>
                    <Card className="bg-gray-900 border-gray-700 mb-4">
                      <CardContent className="p-4">
                        <h3 className="text-md font-semibold mb-2">기본 사용법</h3>
                        <pre className="bg-gray-950 p-4 rounded-md text-gray-300 text-sm overflow-x-auto">
                          {modelData.usage_example || `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "${modelData.title || 'model-name'}"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

inputs = tokenizer("Hello, I'm a language model", return_tensors="pt")
outputs = model.generate(**inputs, max_length=50)
print(tokenizer.decode(outputs[0]))`}
                        </pre>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <h3 className="text-md font-semibold mb-2">입력 예시</h3>
                          <div className="bg-gray-950 p-4 rounded-md text-gray-300 text-sm">
                            {modelData.input_example || "Hello, how can I help you today?"}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="p-4">
                          <h3 className="text-md font-semibold mb-2">출력 예시</h3>
                          <div className="bg-gray-950 p-4 rounded-md text-gray-300 text-sm">
                            {modelData.output_example || "I'm a helpful AI assistant. I can answer questions, provide information, and help with various tasks. What would you like to know?"}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                {selectedTab === "docs" && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">문서</h2>
                    {modelData.documentation ? (
                      <div className="text-gray-300 whitespace-pre-line">
                        {modelData.documentation}
                      </div>
                    ) : (
                      <div className="bg-gray-900 border border-gray-700 rounded-md p-6 text-center">
                        <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-300 mb-1">문서가 없습니다</h3>
                        <p className="text-gray-400">이 모델에 대한 자세한 문서가 아직 제공되지 않았습니다.</p>
                      </div>
                    )}
                    
                    {modelData.docs_url && (
                      <div className="mt-6">
                        <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800" asChild>
                          <Link href={modelData.docs_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            전체 문서 보기
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Related Models */}
              {relatedModels.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">관련 모델</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {relatedModels.map((model) => (
                      <Card key={model.id} className="bg-gray-900 border-gray-700 overflow-hidden">
                        <Link href={`/model/${model.id}`}>
                          <div className="aspect-square relative">
                            <Image
                              src={(model.image_urls && Array.isArray(model.image_urls) && model.image_urls.length > 0)
                                ? model.image_urls[0]
                                : (model.image_url || "/placeholder.svg")}
                              alt={model.title || "관련 모델"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-medium text-gray-200 line-clamp-1">{model.title}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{model.description}</p>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Comments Section */}
              <div className="mb-16">
                <h2 className="text-xl font-bold mb-4">
                  댓글 ({comments?.length || 0})
                </h2>
                
                <div className="mb-6">
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
                    <div className="text-center text-gray-400 py-6">
                      첫 번째 댓글을 남겨보세요!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            {relatedModels.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-[30%] -translate-y-1/2 text-gray-400 hover:text-white rounded-full bg-black/30 hover:bg-black/50 z-10"
                  onClick={handlePrevModel}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-[30%] -translate-y-1/2 text-gray-400 hover:text-white rounded-full bg-black/30 hover:bg-black/50 z-10"
                  onClick={handleNextModel}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 py-3 px-4">
        <div className="flex items-center justify-center gap-6">
          <Button variant="ghost" className="text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
            <Star className="h-5 w-5" />
            <span>{modelData.stars_count || 0}</span>
          </Button>
          <Button variant="ghost" className="text-red-500 hover:text-red-400 flex items-center gap-1">
            <Heart className="h-5 w-5" />
            <span>{modelData.likes_count || 0}</span>
          </Button>
          <Button variant="ghost" className="text-orange-500 hover:text-orange-400 flex items-center gap-1">
            <MessageCircle className="h-5 w-5" />
            <span>{comments?.length || 0}</span>
          </Button>
          <Button variant="ghost" className="text-blue-500 hover:text-blue-400 flex items-center gap-1">
            <Download className="h-5 w-5" />
            <span>{modelData.downloads_count || 0}</span>
          </Button>
          <Button variant="ghost" className="text-purple-500 hover:text-purple-400 flex items-center gap-1">
            <GitFork className="h-5 w-5" />
            <span>{modelData.forks_count || 0}</span>
          </Button>
        </div>
      </footer>
    </div>
  )
} 
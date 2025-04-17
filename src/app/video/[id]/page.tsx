"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from '@supabase/supabase-js'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Settings,
  Download,
  Share,
  MoreVertical,
  Heart,
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Play as PlayIcon,
  Plus
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function VideoDetailPage() {
  const [videoData, setVideoData] = useState<any>(null)
  const [relatedVideos, setRelatedVideos] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  
  // 비디오 플레이어 상태
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const params = useParams()
  const router = useRouter()
  const videoId = params.id as string
  
  // 타임아웃을 위한 ref
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 비디오 및 관련 데이터 가져오기
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setIsLoading(true)

        // 기본 비디오 데이터 가져오기
        const { data: video, error: videoError } = await supabase
          .from('videos')
          .select('*, profiles(*)')
          .eq('id', videoId)
          .single()

        if (videoError) {
          throw new Error('비디오를 불러오는데 실패했습니다.')
        }

        setVideoData(video)

        // 관련 비디오 가져오기
        const { data: relatedData, error: relatedError } = await supabase
          .from('videos')
          .select('*')
          .eq('category', video.category)
          .neq('id', videoId)
          .limit(5)

        if (!relatedError && relatedData) {
          setRelatedVideos(relatedData)
        }

        // 댓글 가져오기
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*, profiles(*)')
          .eq('video_id', videoId)
          .order('created_at', { ascending: false })

        if (!commentsError && commentsData) {
          setComments(commentsData)
        }

        setIsLoading(false)
      } catch (error) {
        console.error('데이터 로딩 오류:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
        setIsLoading(false)
      }
    }

    if (videoId) {
      fetchVideoData()
    }
  }, [videoId])

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setError('데이터 로딩 시간이 너무 오래 걸립니다. 네트워크 연결을 확인해주세요.');
        setIsLoading(false);
      }, 15000); // 15초 후 타임아웃

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // 비디오 플레이어 컨트롤 기능
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0]
    if (videoRef.current) {
      videoRef.current.volume = vol
      setVolume(vol)
      setIsMuted(vol === 0)
    }
  }

  const handleSeek = (time: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time[0]
      setCurrentTime(time[0])
    }
  }

  const forward10Seconds = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10)
    }
  }

  const backward10Seconds = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
    }
  }

  // 컨트롤 표시 타이머 설정
  const showControlsTemporarily = () => {
    setShowControls(true)
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  // 마우스 이벤트 핸들러
  const handleMouseMove = () => {
    showControlsTemporarily()
  }

  const handleMouseLeave = () => {
    if (isPlaying && controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
      setShowControls(false)
    }
  }

  // 타임스탬프 포맷
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

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
            video_id: videoId,
            user_id: userData.user.id,
            content: commentText,
            created_at: new Date().toISOString()
          }
        ])
        .select('*, profiles(*)')

      if (error) {
        console.error('댓글 추가 오류:', error)
        return
      }

      if (data) {
        setComments([data[0], ...comments])
        setCommentText("")
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error)
    }
  }

  // 로딩 중이거나 오류 상태 처리
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">비디오를 불러오는 중...</div>
      </div>
    )
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">{error || '비디오를 찾을 수 없습니다.'}</div>
      </div>
    )
  }

  // 비디오 URL 가져오기
  const videoUrl = videoData.video_url || ''
  const thumbnailUrl = videoData.thumbnail_url || (videoData.image_urls?.[0] || '/placeholder.svg')
  
  // 태그 처리
  const tags = Array.isArray(videoData.tags) ? videoData.tags : []

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-medium text-white text-lg truncate max-w-md">{videoData.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/create/video">
            <Button
              variant="outline"
              className="text-gray-300 border-gray-700 hover:bg-gray-800 text-sm flex items-center gap-1 ml-2"
            >
              <Plus className="h-4 w-4" />
              Upload Video
            </Button>
          </Link>
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
      <main className="pt-16 pb-8 flex flex-col lg:flex-row">
        {/* Video Player Section */}
        <div className="lg:w-3/4 px-4">
          <div 
            className="relative w-full aspect-video bg-black rounded-lg overflow-hidden" 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              poster={thumbnailUrl}
              className="w-full h-full object-contain"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
            
            {/* 비디오 컨트롤 오버레이 */}
            <div 
              className={`absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity ${
                showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* 상단 제목 */}
              <div className="text-white text-lg font-semibold shadow-lg">{videoData.title}</div>
              
              {/* 중앙 재생/정지 버튼 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Button 
                  onClick={togglePlay}
                  variant="ghost" 
                  size="icon" 
                  className="h-16 w-16 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  {isPlaying ? (
                    <Pause className="h-10 w-10" />
                  ) : (
                    <Play className="h-10 w-10 ml-1" />
                  )}
                </Button>
              </div>
              
              {/* 하단 컨트롤 바 */}
              <div className="space-y-2">
                {/* 진행 바 */}
                <div className="w-full">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                </div>
                
                {/* 컨트롤 버튼들 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={togglePlay}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={backward10Seconds}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={forward10Seconds}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <div className="text-sm text-white">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <div className="w-24">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="mt-4 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-white mb-2">{videoData.title}</h1>
              <div className="flex items-center gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{videoData.views_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(videoData.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-gray-800 hover:bg-gray-700 text-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-gray-700">
                  <AvatarImage src="/avatar-placeholder.jpg" alt="User" />
                  <AvatarFallback>{videoData.profiles?.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{videoData.profiles?.username || '익명 사용자'}</h3>
                    <Badge variant="outline" className="text-xs bg-transparent border-blue-500 text-blue-400">
                      <Star className="h-3 w-3 mr-1 fill-blue-400" />
                      Follow
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">
                    {videoData.profiles?.subscribers_count || 0} 구독자
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent border-gray-700 text-gray-200">
                  <Heart className="h-4 w-4 mr-2" />
                  <span>{videoData.likes_count || 0}</span>
                </Button>
                <Button variant="outline" className="bg-transparent border-gray-700 text-gray-200">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>{comments.length}</span>
                </Button>
              </div>
            </div>
            
            {/* 비디오 설명 */}
            {videoData.description && (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{videoData.description}</p>
                </CardContent>
              </Card>
            )}
            
            {/* 댓글 섹션 */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-4">댓글 {comments.length}개</h3>
              
              <div className="mb-4">
                <Textarea 
                  placeholder="댓글을 입력하세요..." 
                  className="bg-gray-900 border-gray-700 text-gray-200 placeholder:text-gray-500 resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button className="mt-2" onClick={handleAddComment}>댓글 작성</Button>
              </div>
              
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8 border border-gray-700">
                      <AvatarImage src="/avatar-placeholder.jpg" alt={comment.profiles?.username || '사용자'} />
                      <AvatarFallback>{comment.profiles?.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-300">{comment.profiles?.username || '익명'}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center text-gray-400 py-4">
                    첫 번째 댓글을 남겨보세요!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Videos Section */}
        <div className="lg:w-1/4 p-4">
          <h3 className="text-lg font-bold text-white mb-4">관련 동영상</h3>
          
          <div className="space-y-4">
            {relatedVideos.map((video) => (
              <Link href={`/video/${video.id}`} key={video.id}>
                <div className="flex gap-2 group cursor-pointer">
                  <div className="relative w-40 h-24 bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={video.thumbnail_url || (video.image_urls?.[0] || '/placeholder.svg')}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {video.duration || '00:00'}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-blue-400">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {video.profiles?.username || '익명 사용자'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{video.views_count || 0} 조회</span>
                      <span>•</span>
                      <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {relatedVideos.length === 0 && (
              <div className="text-center text-gray-400 py-4">
                관련 동영상이 없습니다.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 
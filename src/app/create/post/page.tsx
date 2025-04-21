"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, ImageIcon, Code, Link as LinkIcon, ListOrdered, List, Bold, Italic, X, Settings, Underline as UnderlineIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation/navigation"
import { CategoryNavigation } from "@/components/category/category-navigation"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from '@supabase/supabase-js'
import NextImage from "next/image"
import MDEditor from '@uiw/react-md-editor'

// Supabase 클라이언트 직접 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("ComfyUI")
  const [tags, setTags] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [showComfyUiSettings, setShowComfyUiSettings] = useState(false)
  const [positivePrompt, setPositivePrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [imageWidth, setImageWidth] = useState(512)
  const [imageHeight, setImageHeight] = useState(512)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        console.log('사용자 데이터:', data)
        
        if (error) {
          console.error('인증 오류:', error)
          return
        }
        
        if (data?.user) {
          setUserId(data.user.id)
          console.log('로그인 상태 확인됨:', data.user.id)
        } else {
          console.log('로그인되지 않음')
        }
      } catch (err) {
        console.error('인증 확인 중 오류:', err)
      }
    }
    
    checkAuth()
  }, [])

  // 문서 전체에 붙여넣기 이벤트 리스너 추가
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            // 파일 배열에 추가
            setFiles(prevFiles => [...prevFiles, file]);
            
            // 이미지 URL 생성 및 상태에 추가
            const imageUrl = URL.createObjectURL(file);
            setImageUrls(prevUrls => [...prevUrls, imageUrl]);
            
            // 에디터에 이미지 삽입
            insertImageToContent(imageUrl);
            
            toast({
              title: "이미지 붙여넣기 성공",
              description: "이미지가 에디터에 추가되었습니다.",
            });
            
            // 아직 커버 이미지가 없다면 자동으로 설정
            if (!coverImage) {
              setCoverImage(file);
              setCoverImageUrl(imageUrl);
            }
          }
        }
      }
    };
    
    document.addEventListener('paste', handleGlobalPaste);
    
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [coverImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(prevFiles => [...prevFiles, ...selectedFiles])
      
      // 이미지 파일 미리보기 URL 생성
      const newImageUrls = selectedFiles.map(file => URL.createObjectURL(file))
      setImageUrls(prevUrls => [...prevUrls, ...newImageUrls])

      // 아직 커버 이미지가 없고 처음 업로드한 이미지가 있다면 자동으로 커버 이미지로 설정
      if (!coverImage && selectedFiles.length > 0) {
        setCoverImage(selectedFiles[0]);
        setCoverImageUrl(URL.createObjectURL(selectedFiles[0]));
      }
    }
  }
  
  const removeFile = (index: number) => {
    // 파일과 URL 배열에서 해당 인덱스 항목 제거
    const fileToRemove = files[index];
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
    
    // 미리보기 URL 제거 전에 URL 객체 해제
    URL.revokeObjectURL(imageUrls[index])
    setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index))

    // 커버 이미지가 삭제되는 경우 처리
    if (coverImage === fileToRemove) {
      setCoverImage(null);
      if (coverImageUrl) {
        URL.revokeObjectURL(coverImageUrl);
        setCoverImageUrl(null);
      }
    }
  }

  const setCoverImageFromExisting = (file: File, url: string) => {
    // 기존 커버 이미지가 있으면 URL 객체 해제
    if (coverImageUrl) {
      URL.revokeObjectURL(coverImageUrl);
    }
    
    setCoverImage(file);
    setCoverImageUrl(url);
    
    toast({
      title: "커버 이미지 설정됨",
      description: "선택한 이미지가 커버 이미지로 설정되었습니다."
    });
  }

  const insertImageToContent = (url: string) => {
    const imageMarkdown = `\n![이미지](${url})\n`;
    setContent(prev => prev + imageMarkdown);
    
    toast({
      title: "이미지 추가 성공",
      description: "에디터에 이미지가 추가되었습니다.",
    });
  };

  const handleInsertImageToEditor = (file: File) => {
    // 파일 배열에 추가
    setFiles(prevFiles => [...prevFiles, file]);
    
    // 이미지 URL 생성 및 상태에 추가
    const imageUrl = URL.createObjectURL(file);
    setImageUrls(prevUrls => [...prevUrls, imageUrl]);
    
    // 텍스트 에디터에 이미지 마크다운 삽입
    insertImageToContent(imageUrl);
  };

  const handleSubmit = async () => {
    try {
      // 직접 사용자 확인
      const { data, error } = await supabase.auth.getUser()
      console.log('POST 요청 전 사용자 데이터:', data)
      
      if (error) {
        console.error('인증 오류:', error)
        toast({
          title: "오류",
          description: "인증에 실패했습니다.",
          variant: "destructive",
        })
        return
      }
      
      if (!data?.user) {
        toast({
          title: "오류",
          description: "로그인이 필요합니다.",
          variant: "destructive",
        })
        return
      }
      
      const currentUserId = data.user.id
      console.log('확인된 사용자 ID:', currentUserId)

      if (!title || !content) {
        toast({
          title: "오류",
          description: "제목과 내용을 모두 입력해주세요.",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)

      // 이미지 업로드
      const uploadedImageUrls = []
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, file)

          if (uploadError) {
            console.error('이미지 업로드 에러:', uploadError)
            throw new Error('이미지 업로드에 실패했습니다.')
          }

          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath)

          uploadedImageUrls.push(publicUrl)
          
          // 커버 이미지 확인
          if (coverImage === file) {
            setCoverImageUrl(publicUrl);
          }
        }
      }

      // 포스트 데이터 준비
      const postData: any = {
        title,
        content,
        category: selectedCategory,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        user_id: currentUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'published',
        likes_count: 0,
        views_count: 0,
        comments_count: 0,
        image_urls: uploadedImageUrls
      };

      // 커버 이미지가 있는 경우 추가
      if (coverImageUrl) {
        postData.cover_image_url = coverImageUrl;
      }

      // DB에 저장
      const { error: insertError } = await supabase
        .from('posts')
        .insert(postData);

      if (insertError) {
        console.error('포스트 저장 에러:', insertError)
        throw new Error(insertError.message)
      }

      console.log('포스트 저장 완료!')
      
      toast({
        title: "성공",
        description: "포스트가 성공적으로 작성되었습니다.",
      })

      router.push('/posts')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "포스트 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      // 직접 사용자 확인
      const { data, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('인증 오류:', error)
        toast({
          title: "오류",
          description: "인증에 실패했습니다.",
          variant: "destructive",
        })
        return
      }
      
      if (!data?.user) {
        toast({
          title: "오류",
          description: "로그인이 필요합니다.",
          variant: "destructive",
        })
        return
      }
      
      const currentUserId = data.user.id

      if (!title) {
        toast({
          title: "오류",
          description: "최소한 제목은 입력해주세요.",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)

      // 임시저장
      const { error: insertError } = await supabase
        .from('drafts')
        .insert({
          title,
          content,
          category: selectedCategory,
          tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
          user_id: currentUserId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error('임시저장 중 에러:', insertError)
        throw new Error(insertError.message)
      }

      toast({
        title: "성공",
        description: "임시저장되었습니다.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "오류",
        description: "임시저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const insertComfyUISettings = () => {
    if (!positivePrompt) {
      toast({
        title: "입력 필요",
        description: "최소한 Positive 프롬프트를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const comfyUISettingsMarkdown = `
## ComfyUI 설정

### Positive 프롬프트:
\`\`\`
${positivePrompt}
\`\`\`

${negativePrompt ? `### Negative 프롬프트:
\`\`\`
${negativePrompt}
\`\`\`
` : ''}

### 이미지 크기:
${imageWidth} x ${imageHeight}
`;

    setContent(prevContent => prevContent + comfyUISettingsMarkdown)
    setShowComfyUiSettings(false)
    toast({
      title: "성공",
      description: "ComfyUI 설정이 게시글에 추가되었습니다.",
    })
  }

  // 게시물 삭제 처리
  const handleDeletePost = () => {
    // 작성 중인 게시물이므로 모든 상태 초기화
    setTitle("");
    setContent("");
    setFiles([]);
    setImageUrls(prevUrls => {
      // 모든 URL 객체 해제
      prevUrls.forEach(url => URL.revokeObjectURL(url));
      return [];
    });
    setCoverImage(null);
    if (coverImageUrl) {
      URL.revokeObjectURL(coverImageUrl);
      setCoverImageUrl(null);
    }
    setTags("");
    
    toast({
      title: "게시물 삭제됨",
      description: "작성 중인 게시물이 삭제되었습니다."
    });
    
    // 홈페이지로 리디렉션
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CategoryNavigation type="post" selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      
      <main className="mx-auto px-0 sm:px-2 md:px-4 lg:px-6 py-2 max-w-7xl w-full">
        {/* Header with Actions */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Create Post</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" disabled={isLoading} onClick={handleSaveDraft}>
                임시저장
              </Button>
              <Button disabled={isLoading} onClick={handleSubmit}>
                {isLoading ? "게시 중..." : "게시하기"}
              </Button>
              <Button variant="destructive" onClick={handleDeletePost}>
                삭제
              </Button>
            </div>
          </div>
          
          {/* Edit/Preview Tabs */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'edit' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('edit')}
            >
              Edit
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'preview' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="md:col-span-2 space-y-6">
            <Input
              placeholder="Add a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold"
            />

            {activeTab === 'edit' ? (
              <>
                {/* Markdown 에디터 */}
                <div data-color-mode="dark">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    height={400}
                    preview="edit"
                    commands={[
                      // 기본 명령어 외에 추가 기능
                      {
                        name: 'image',
                        keyCommand: 'image',
                        buttonProps: { 'aria-label': '이미지 삽입' },
                        icon: <ImageIcon className="h-4 w-4" />,
                        execute: () => {
                          const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.click();
                          }
                        },
                      }
                    ]}
                  />
                </div>
              </>
            ) : (
              // Preview Mode
              <div className="border rounded-md p-6 min-h-[400px]">
                <h1 className="text-2xl font-bold mb-4">{title || "제목 없음"}</h1>
                
                {coverImageUrl && (
                  <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                    <NextImage
                      src={coverImageUrl}
                      alt="Cover Image"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                
                <div data-color-mode="dark">
                  <MDEditor.Markdown source={content} />
                </div>
              </div>
            )}

          
            {/* 업로드된 이미지 미리보기 */}
            {activeTab === 'edit' && imageUrls.length > 0 && (
              <div className="p-4 border rounded-lg">
                <h3 className="text-base font-medium mb-4">업로드된 이미지</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    url ? (
                      <div key={index} className="relative group">
                        <div className={`w-full aspect-square relative rounded-lg overflow-hidden border ${
                          files[index] === coverImage ? 'ring-2 ring-primary' : ''
                        }`}>
                          <NextImage 
                            src={url} 
                            alt={`업로드 이미지 ${index + 1}`} 
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {files[index] === coverImage && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                              커버
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => insertImageToContent(url)}
                            className="mx-1"
                          >
                            삽입
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => setCoverImageFromExisting(files[index], url)}
                            className="mx-1"
                          >
                            커버로 설정
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="mx-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 space-y-4">
              <h2 className="font-semibold">Post Settings</h2>
              
              <div className="space-y-4">
                {/* 커버 이미지 표시 */}
                {coverImageUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">커버 이미지</label>
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                      <NextImage
                        src={coverImageUrl}
                        alt="Cover Image"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          if (coverImageUrl) {
                            URL.revokeObjectURL(coverImageUrl);
                          }
                          setCoverImage(null);
                          setCoverImageUrl(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ComfyUI">ComfyUI</SelectItem>
                      <SelectItem value="Plans">Plans</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Youtube">Youtube</SelectItem>
                      <SelectItem value="Tiktok">Tiktok</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Think">Think</SelectItem>
                      <SelectItem value="Idea">Idea</SelectItem>
                      <SelectItem value="Philosophy">Philosophy</SelectItem>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="React-native">React-native</SelectItem>
                      <SelectItem value="Springboot">Springboot</SelectItem>
                      <SelectItem value="CursorAI">CursorAI</SelectItem>
                      <SelectItem value="App">App</SelectItem>
                      <SelectItem value="MCP">MCP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input 
                    placeholder="Add tags (comma separated)" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
            </div>

             {/* File Upload */}
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept=".png,.jpeg,.jpg,.webp,.mp4,.webm"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-base font-medium mb-2">
                  Add images to your post
                </h3>
                <p className="text-sm text-muted-foreground">
                  첫 번째 이미지는 자동으로 커버 이미지로 설정됩니다
                </p>
              </label>
            </div>

            <div className="bg-card rounded-lg p-6 space-y-4">
              <h2 className="font-semibold">Tips</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 각 게시물에는 커버 이미지를 설정하세요</li>
                <li>• Edit/Preview 탭으로 미리보기를 확인하세요</li>
                <li>• Tag를 통해 게시물 검색을 용이하게 하세요</li>
                <li>• 작성 중 임시저장도 가능합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 
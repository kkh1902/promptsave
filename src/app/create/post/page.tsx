"use client"

import { useState } from "react"
import { ArrowLeft, ImageIcon, Code, Link as LinkIcon, ListOrdered, List, Bold, Italic, Underline } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation/navigation"
import { CategoryNavigation } from "@/components/category/category-navigation"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [tags, setTags] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
    }
  }

  const handleSubmit = async () => {
    if (!title || !content) {
      toast({
        title: "오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 이미지 업로드
      const imageUrls = []
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, file)

          if (uploadError) {
            throw uploadError
          }

          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath)

          imageUrls.push(publicUrl)
        }
      }

      // 포스트 데이터 저장
      const { error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          category: selectedCategory,
          tags: tags.split(',').map(tag => tag.trim()),
          images: imageUrls,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast({
        title: "성공",
        description: "포스트가 성공적으로 작성되었습니다.",
      })

      router.push('/posts')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "오류",
        description: "포스트 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!title) {
      toast({
        title: "오류",
        description: "최소한 제목은 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('drafts')
        .insert({
          title,
          content,
          category: selectedCategory,
          tags: tags.split(',').map(tag => tag.trim()),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CategoryNavigation type="post" selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create Post</h1>
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

            {/* Text Editor Toolbar */}
            <div className="flex items-center space-x-1 border-b pb-2">
              <Button variant="ghost" size="icon">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Underline className="h-4 w-4" />
              </Button>
              <div className="w-px h-4 bg-border mx-2" />
              <Button variant="ghost" size="icon">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Code className="h-4 w-4" />
              </Button>
            </div>

            <Textarea
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px]"
            />

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
                  Drag and drop or click to upload
                </p>
              </label>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 space-y-4">
              <h2 className="font-semibold">Post Settings</h2>
              
              <div className="space-y-4">
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

              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "게시 중..." : "Post"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                >
                  {isLoading ? "저장 중..." : "Save as Draft"}
                </Button>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 space-y-4">
              <h2 className="font-semibold">Tips</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Use clear headings to organize your content</li>
                <li>• Add images to illustrate your points</li>
                <li>• Tag your post to help others find it</li>
                <li>• Use formatting to highlight important points</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 
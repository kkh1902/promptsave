"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Navigation } from "@/components/navigation/navigation";
import { CategoryNavigation } from "@/components/category/category-navigation";
import { Footer } from "@/components/footer/footer";
import MDEditor, { commands, TextAreaTextApi } from '@uiw/react-md-editor';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PostData {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category: string;
  tags?: string[];
  image_urls?: string[];
  cover_image_url?: string | null;
}

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<string | undefined>('');
  const [selectedCategory, setSelectedCategory] = useState("ComfyUI");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // 새로 추가/붙여넣기 된 파일 및 URL 관리
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newImageLocalUrls, setNewImageLocalUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // MDEditor ref 추가
  const editorRef = useRef<{ textarea?: HTMLTextAreaElement; api?: TextAreaTextApi } | null>(null);

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  // 포스트 데이터 로드
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      setIsLoading(true);
      setError(null);
      setNewFiles([]);
      setNewImageLocalUrls([]);
      
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('포스트를 찾을 수 없습니다.');
        if (currentUser && data.user_id !== currentUser.id) throw new Error('수정 권한이 없습니다.');

        setPost(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setSelectedCategory(data.category || 'ComfyUI');
        setTags(data.tags?.join(', ') || '');
        setExistingImageUrls(data.image_urls || []);

      } catch (err: any) {
        console.error('포스트 로딩 오류:', err);
        setError(err.message || '포스트를 불러오는 중 오류가 발생했습니다.');
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser !== null) {
      fetchPost();
    }
  }, [postId, currentUser]);

  // 이미지 에디터 커서 위치에 삽입 함수 (수정됨)
  const insertImageToContent = (url: string) => {
    if (!editorRef.current || !editorRef.current.textarea) {
      // Ref가 아직 준비되지 않았거나 textarea가 없으면 기존 방식대로 맨 뒤에 추가
      const imageMarkdown = `\n![이미지](${url})\n`;
      setContent(prev => (prev || '') + imageMarkdown);
      toast.info("에디터 준비 중... 이미지 내용 끝에 추가됨");
      return;
    }

    const textarea = editorRef.current.textarea;
    const imageMarkdown = `\n![이미지](${url})\n`;
    
    // 현재 커서/선택 위치 가져오기 (textarea 사용)
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = textarea.value;

    // 커서 위치에 마크다운 삽입
    const newContent = 
      currentContent.substring(0, start) + 
      imageMarkdown + 
      currentContent.substring(end);

    // 상태 업데이트 -> MDEditor에 반영
    setContent(newContent);

    // 커서를 삽입된 텍스트 뒤로 이동 (비동기 처리 필요할 수 있음)
    setTimeout(() => {
      const newCursorPos = start + imageMarkdown.length;
      textarea.focus(); // 포커스 재설정
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    toast.success("이미지가 커서 위치에 추가되었습니다.");
  };

  // 붙여넣기 이벤트 핸들러
  const handleGlobalPaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    // 에디터가 활성화되어 있는지 확인 (선택적)
    // if (document.activeElement !== editorRef.current?.textarea) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const localUrl = URL.createObjectURL(file);
          
          // 새 파일과 로컬 URL 상태 업데이트
          setNewFiles(prevFiles => [...prevFiles, file]);
          setNewImageLocalUrls(prevUrls => [...prevUrls, localUrl]);
          
          // 에디터에 이미지 삽입 (커서 위치에)
          insertImageToContent(localUrl);
          
          // Prevent default paste behavior for images
          e.preventDefault(); 
        }
      }
    }
  };

  // 붙여넣기 이벤트 리스너 등록 및 해제
  useEffect(() => {
    document.addEventListener('paste', handleGlobalPaste);
    return () => {
      document.removeEventListener('paste', handleGlobalPaste);
      // 컴포넌트 언마운트 시 생성된 로컬 URL 해제
      newImageLocalUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newImageLocalUrls]);

  // 폼 제출 핸들러 수정
  const handleSubmit = async () => {
    if (!post || isSubmitting || !currentUser || post.user_id !== currentUser.id) return;
    if (!title || !content) {
        toast.error("제목과 내용을 모두 입력해주세요.");
        return;
    }

    setIsSubmitting(true);
    let finalContent = content || '';
    const uploadedPublicUrls: string[] = [];

    try {
      // 1. 새로 추가된 이미지 업로드
      if (newFiles.length > 0) {
        toast.info("새 이미지 업로드 중...");
        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
          const localUrl = newImageLocalUrls[i]; // 해당 파일의 로컬 URL
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('posts') // 'posts' 버킷 사용 확인
            .upload(filePath, file);

          if (uploadError) {
            console.error('이미지 업로드 에러:', uploadError);
            throw new Error(`'${file.name}' 이미지 업로드 실패: ${uploadError.message}`);
          }

          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);
          
          if (!publicUrl) {
             throw new Error(`'${file.name}' 이미지의 Public URL을 가져오는데 실패했습니다.`);
          }

          uploadedPublicUrls.push(publicUrl);

          // 2. 내용(Content)에서 로컬 URL을 Public URL로 교체
          // 주의: 정규식 사용 시 특수 문자 이스케이프 필요
          const escapedLocalUrl = localUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          finalContent = finalContent.replace(new RegExp(escapedLocalUrl, 'g'), publicUrl);
          
          // 업로드 후 로컬 URL 해제 (선택적, useEffect에서도 처리됨)
           URL.revokeObjectURL(localUrl);
        }
      }
      
      // 3. 최종 이미지 URL 목록 생성 (기존 URL + 새로 업로드된 URL)
      const finalImageUrls = [...existingImageUrls, ...uploadedPublicUrls];
      
      // 4. 포스트 데이터 업데이트
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          title: title,
          content: finalContent, // Public URL로 교체된 내용 사용
          category: selectedCategory,
          tags: tagsArray,
          image_urls: finalImageUrls, // 합쳐진 이미지 URL 목록 사용
          updated_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (updateError) throw updateError;

      toast.success('포스트가 성공적으로 수정되었습니다.');
      setNewFiles([]); // 성공 시 새 파일 목록 초기화
      setNewImageLocalUrls([]); // 성공 시 로컬 URL 목록 초기화
      router.push(`/posts/${postId}`);
      router.refresh();

    } catch (err: any) {
      console.error('포스트 수정 오류:', err);
      toast.error(`수정 실패: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 새로 추가된 이미지 미리보기 제거 함수
  const removeNewImage = (index: number) => {
    const urlToRemove = newImageLocalUrls[index];
    const fileToRemove = newFiles[index];

    // 상태에서 제거
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewImageLocalUrls(prev => prev.filter((_, i) => i !== index));

    // 내용에서 해당 이미지 마크다운 제거 (간단한 방법: URL 기준 제거)
    // 복잡한 제거 로직이 필요할 수 있음 (예: 사용자가 마크다운을 수동으로 변경한 경우)
    const imageMarkdown = `\n![이미지](${urlToRemove})\n`;
    setContent(prev => (prev || '').replace(imageMarkdown, '')); 

    // 로컬 URL 해제
    URL.revokeObjectURL(urlToRemove);

    toast.warning(`'${fileToRemove.name}' 이미지가 제거되었습니다.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <CategoryNavigation type="post" selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <div className="container mx-auto p-4 text-center">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <CategoryNavigation type="post" selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <div className="container mx-auto p-4 text-center text-red-500">오류: {error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <CategoryNavigation type="post" selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <div className="container mx-auto p-4 text-center text-red-500">포스트를 표시할 수 없습니다.</div>
      </div>
    );
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
              <Button variant="ghost" size="icon" className="hover:bg-accent" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">포스트 수정</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push(`/posts/${postId}`)} disabled={isSubmitting}>
                취소
              </Button>
              <Button disabled={isSubmitting || isLoading} onClick={handleSubmit}>
                {isSubmitting ? '수정 중...' : '수정 완료'}
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
              placeholder="제목을 입력하세요..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold"
              disabled={isSubmitting}
              required
            />

            {activeTab === 'edit' ? (
              <div data-color-mode="dark">
                <MDEditor
                  ref={editorRef}
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  height={400}
                  preview="edit"
                  // 필요한 명령어 추가 가능
                />
              </div>
            ) : (
              <div className="border rounded-md p-6 min-h-[400px]">
                <h1 className="text-2xl font-bold mb-4">{title || "제목 없음"}</h1>
                <div data-color-mode="dark">
                  <MDEditor.Markdown source={content} />
                </div>
              </div>
            )}

            {/* 새로 추가된 이미지 미리보기 섹션 */}
            {newImageLocalUrls.length > 0 && (
              <div className="p-4 border rounded-lg">
                <h3 className="text-base font-medium mb-4">새로 추가된 이미지 (저장 시 업로드됨)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newImageLocalUrls.map((url, index) => (
                    <div key={url} className="relative group">
                      <div className="w-full aspect-square relative rounded-lg overflow-hidden border">
                        <NextImage 
                          src={url} 
                          alt={`새 이미지 ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized // 로컬 URL은 최적화 불필요
                        />
                      </div>
                      <div className="absolute top-1 right-1">
                         <Button 
                          variant="destructive" 
                          size="sm"
                          className="p-1 h-6 w-6 opacity-80 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewImage(index)} // 이미지 제거 버튼
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                       <p className="text-xs text-muted-foreground mt-1 truncate" title={newFiles[index]?.name}>
                        {newFiles[index]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card rounded-lg p-6 space-y-4">
              <h2 className="font-semibold">게시물 설정</h2>
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isSubmitting}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: 실제 카테고리 목록 가져오기 */} 
                    <SelectItem value="ComfyUI">ComfyUI</SelectItem>
                    <SelectItem value="StableDiffusion">StableDiffusion</SelectItem>
                    <SelectItem value="Fooocus">Fooocus</SelectItem>
                    <SelectItem value="A1111">A1111</SelectItem>
                    <SelectItem value="Civitai">Civitai</SelectItem>
                    <SelectItem value="TensorArt">TensorArt</SelectItem>
                    <SelectItem value="SeaArt">SeaArt</SelectItem>
                    <SelectItem value="PlaygroundAI">PlaygroundAI</SelectItem>
                    <SelectItem value="etc">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">태그</Label>
                <Input 
                  id="tags"
                  placeholder="태그 추가 (쉼표로 구분)" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
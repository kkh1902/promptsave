"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CategoryNavigation } from "@/components/category/category-navigation"
import { Navigation } from "@/components/navigation/navigation"
import { createClient } from '@supabase/supabase-js'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Video,
  Code,
  Plus,
  Info,
  MoreVertical,
  Trash2,
  Edit as EditIcon,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  X,
  Clock,
  HelpCircle,
} from "lucide-react"
import { PromptSection, ResourcesSection, ToolsSection, TechniquesSection, PromptEditDialog } from "./components"

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 관리자 권한으로 데이터베이스 작업을 수행하기 위한 서비스 클라이언트
// IMPORTANT: 이 키는 클라이언트 사이드에 노출되면 안됩니다. 서버 사이드 API로 옮겨야 합니다.
// 이 코드는 임시 해결책입니다.
const getServiceSupabase = () => {
  const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey);
}

// 이미지 항목 타입 정의
interface ImageItem {
  id: string;
  url: string;
  title: string;
  description: string;
  prompt: string;
  negativePrompt: string;
  resources: string[];
  tools: string[];
  techniques: string[];
  tags: string[];
  guidanceScale?: string;
}

export default function CreateImagePage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const [postStatus, setPostStatus] = useState<"hidden" | "published">("hidden");
  const [isPromptEditOpen, setIsPromptEditOpen] = useState(false);
  const [clipSkip, setClipSkip] = useState("1");
  const [imageSize, setImageSize] = useState("512x512");
  const [steps, setSteps] = useState("2");
  const [sampler, setSampler] = useState("Euler");
  const [seed, setSeed] = useState("1");

  // 현재 선택된 이미지 항목 가져오기
  const selectedImage = selectedImageIndex >= 0 ? images[selectedImageIndex] : null;

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files)
        .filter(file => file.type.startsWith("image/"))
        .map(file => {
          const url = URL.createObjectURL(file);
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url,
            title,
            description,
            prompt: "",
            negativePrompt: "",
            resources: [],
            tools: [],
            techniques: [],
            tags: [],
            guidanceScale: "1.0"
          };
        });

      // 이미지 배열에 추가하고 선택
      setImages([...images, ...newImages]);
      setSelectedImageIndex(images.length);
      setIsSaved(false);
      
      // 이미지 분석 시뮬레이션
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        // 자동으로 리소스 감지 시뮬레이션
        if (newImages.length > 0) {
          const updatedImages = [...images, ...newImages];
          updatedImages[images.length].resources = ["Stable Diffusion XL 1.0"];
          setImages(updatedImages);
        }
      }, 2000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files)
        .filter(file => file.type.startsWith("image/"))
        .map(file => {
          const url = URL.createObjectURL(file);
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url,
            title,
            description,
            prompt: "",
            negativePrompt: "",
            resources: [],
            tools: [],
            techniques: [],
            tags: [],
            guidanceScale: "1.0"
          };
        });

      // 이미지 배열에 추가
      setImages([...images, ...newImages]);
      setSelectedImageIndex(images.length);
      setIsSaved(false);
      
      // 이미지 분석 시뮬레이션
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        // 자동으로 리소스 감지 시뮬레이션
        if (newImages.length > 0) {
          const updatedImages = [...images, ...newImages];
          updatedImages[images.length].resources = ["Stable Diffusion XL 1.0"];
          setImages(updatedImages);
        }
      }, 2000);
    }
  };

  // 이미지 속성 업데이트 함수
  const updateImageProperty = <K extends keyof ImageItem>(property: K, value: ImageItem[K]) => {
    if (selectedImageIndex >= 0) {
      const updatedImages = [...images];
      updatedImages[selectedImageIndex] = {
        ...updatedImages[selectedImageIndex],
        [property]: value
      };
      setImages(updatedImages);
      setIsSaved(false);
    }
  };

  // 태그 추가 함수
  const handleAddTag = (tag: string) => {
    if (selectedImageIndex >= 0) {
      const updatedImages = [...images];
      if (!updatedImages[selectedImageIndex].tags.includes(tag)) {
        updatedImages[selectedImageIndex].tags = [...updatedImages[selectedImageIndex].tags, tag];
        setImages(updatedImages);
        setIsSaved(false);
      }
    }
  };

  // 리소스 추가 함수
  const handleAddResource = () => {
    if (selectedImage) {
      updateImageProperty('resources', [...selectedImage.resources, "New Resource"]);
      setIsSaved(false);
    }
  };

  // 도구 추가 함수
  const handleAddTool = () => {
    if (selectedImage) {
      updateImageProperty('tools', [...selectedImage.tools, "New Tool"]);
      setIsSaved(false);
    }
  };

  // 기법 추가 함수
  const handleAddTechnique = () => {
    if (selectedImage) {
      updateImageProperty('techniques', [...selectedImage.techniques, "New Technique"]);
      setIsSaved(false);
    }
  };

  // 이미지 삭제 함수
  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setIsSaved(false);
    
    // 선택된 이미지 조정
    if (newImages.length === 0) {
      setSelectedImageIndex(-1);
    } else if (index <= selectedImageIndex) {
      // 삭제된 이미지가 현재 선택된 이미지거나 그 앞에 있는 경우
      setSelectedImageIndex(Math.max(0, selectedImageIndex - 1));
    }
  };

  // 이전 이미지 선택
  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // 다음 이미지 선택
  const handleNextImage = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  // 이미지 저장 함수
  const saveImageToDatabase = async (imageData: any) => {
    try {
      console.log("Supabase 정보:", { 
        url: !!supabaseUrl, 
        key: !!supabaseAnonKey
      });
      
      // 기본 클라이언트로 시도
      const { data, error } = await supabase
        .from('images')
        .insert([imageData])
        .select();
        
      if (error) {
        console.error("저장 실패:", error);
        throw new Error(`이미지 저장 실패: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error("이미지 저장 오류:", error);
      throw error;
    }
  };

  // 게시하기 함수
  const handlePublish = async () => {
    try {
      setIsSaved(true);
      setPostStatus("published");
      
      if (!title) {
        alert("제목을 입력해주세요.");
        return;
      }
      
      if (images.length === 0) {
        alert("이미지를 업로드해주세요.");
        return;
      }
      
      // 로그인 유저 정보 가져오기
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
        return;
      }
      
      const userId = userData.user.id;
      
      // 이미지 파일 업로드 및 URL 저장
      const imageUrls: string[] = [];
      
      for (const image of images) {
        // URL이 이미 objectURL 형식이면 실제 파일로 변환하여 Supabase Storage에 업로드
        if (image.url.startsWith('blob:')) {
          // 파일 객체 얻기
          const fileResponse = await fetch(image.url);
          const fileBlob = await fileResponse.blob();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.jpg`;
          
          try {
            // Supabase Storage에 업로드
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('outputimage')
              .upload(`${fileName}`, fileBlob);
            
            if (uploadError) {
              console.error("업로드 오류:", uploadError);
              throw new Error(`이미지 업로드 실패: ${uploadError.message}`);
            }
            
            // 업로드된 이미지의 공개 URL 가져오기
            const { data: { publicUrl } } = supabase.storage
              .from('outputimage')
              .getPublicUrl(`${fileName}`);
            
            console.log("이미지 업로드 성공:", publicUrl);
            imageUrls.push(publicUrl);
          } catch (e) {
            console.error("이미지 업로드 중 오류 발생:", e);
            throw e;
          }
        } else {
          // 이미 업로드된 이미지 URL인 경우 그대로 사용
          imageUrls.push(image.url);
        }
      }
      
      // 사용자가 선택한 이미지와 관련 정보 저장
      const selectedImage = images[selectedImageIndex >= 0 ? selectedImageIndex : 0];
      
      // 이미지 데이터 준비 - 데이터베이스 스키마에 맞는 필드만 포함
      const imageData = {
        title: title,
        content: description,
        url: imageUrls[0], // 첫 번째 이미지만 사용
        tags: selectedImage.tags || [],
        user_id: userId,
        created_at: new Date().toISOString(),
        prompt: selectedImage.prompt || "",
        negative_prompt: selectedImage.negativePrompt || "",
        resources: selectedImage.resources || [],
        tools: selectedImage.tools || [],
        likes_count: 0,
        comments_count: 0,
        views_count: 0,
        is_deleted: false,
        is_public: true
      };
      
      console.log("저장할 이미지 데이터:", imageData);
      
      // 직접 Supabase 데이터베이스에 저장하기
      const insertedData = await saveImageToDatabase(imageData);
      
      console.log("데이터 저장 성공:", insertedData);
      alert("이미지가 성공적으로 게시되었습니다!");
      
      // 메인 페이지로 리디렉션
      window.location.href = "/";
    } catch (error) {
      console.error("게시 중 오류 발생:", error);
      alert(`게시 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    }
  };

  // 게시물 삭제 함수
  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setImages([]);
      setSelectedImageIndex(-1);
      setTitle("");
      setDescription("");
      setIsSaved(true);
    }
  };

  // 자동 저장 효과
  useEffect(() => {
    if (!isSaved) {
      const timer = setTimeout(() => {
        setIsSaved(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [title, description, images, isSaved]);

  // 문서 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownIds = ['resources-dropdown', 'tools-dropdown', 'techniques-dropdown'];
      const dropdowns = dropdownIds.map(id => document.getElementById(id));
      const buttons = document.querySelectorAll('button');
      
      // 클릭된 요소가 버튼이 아닌지 확인
      let isClickedOnButton = false;
      buttons.forEach(button => {
        if (button.contains(event.target as Node)) {
          isClickedOnButton = true;
        }
      });
      
      // 버튼을 클릭한 경우 드롭다운 닫기 처리를 하지 않음
      if (isClickedOnButton) return;
      
      // 클릭된 요소가 드롭다운 내부에 없으면 모든 드롭다운 닫기
      let isClickInsideDropdown = false;
      dropdowns.forEach(dropdown => {
        if (dropdown && dropdown.contains(event.target as Node)) {
          isClickInsideDropdown = true;
        }
      });
      
      if (!isClickInsideDropdown) {
        closeAllDropdowns();
      }
    };
    
    // 이벤트 리스너 등록
    document.addEventListener('click', handleClickOutside);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 모든 드롭다운 메뉴 닫기
  const closeAllDropdowns = (exceptId?: string) => {
    const dropdownIds = ['resources-dropdown', 'tools-dropdown', 'techniques-dropdown'];
    dropdownIds.forEach(id => {
      if (id !== exceptId) {
        document.getElementById(id)?.classList.add('hidden');
      }
    });
  };

  // 특정 드롭다운 토글
  const toggleDropdown = (id: string) => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      if (dropdown.classList.contains('hidden')) {
        closeAllDropdowns(id);
        dropdown.classList.remove('hidden');
      } else {
        dropdown.classList.add('hidden');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navigation />
      <CategoryNavigation type="image" selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      
      {/* 프롬프트 편집 다이얼로그 */}
      <PromptEditDialog 
        isOpen={isPromptEditOpen}
        onOpenChange={setIsPromptEditOpen}
        selectedImage={selectedImage}
        updateImageProperty={updateImageProperty}
        setImages={setImages}
        setSelectedImageIndex={setSelectedImageIndex}
        title={title}
        description={description}
        images={images}
        clipSkip={clipSkip}
        setClipSkip={setClipSkip}
        steps={steps}
        setSteps={setSteps}
        sampler={sampler}
        setSampler={setSampler}
        seed={seed}
        setSeed={setSeed}
      />

      <main className="mx-auto px-0 sm:px-2 md:px-4 lg:px-6 py-2 max-w-7xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
          <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-gray-800 text-gray-300">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
            <h1 className="text-2xl font-bold text-white">Create Image</h1>
          </div>
        </div>

        <div className="mb-8">
          <Input
            placeholder="Add a title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsSaved(false);
            }}
            className="bg-transparent border-0 border-b border-gray-700 rounded-none text-xl font-medium text-white px-0 focus-visible:ring-0 focus-visible:border-blue-500"
          />
        </div>

        <div className="flex mb-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 p-1 h-8">
            <Plus className="h-4 w-4 mr-1" />
            Tag
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Editor */}
          <div className="md:col-span-2 space-y-6">
            {/* Text Editor */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-md overflow-hidden">
              <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-700">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Underline className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Strikethrough className="h-4 w-4" />
                </Button>
                <div className="h-5 w-px bg-gray-700 mx-1"></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <div className="h-5 w-px bg-gray-700 mx-1"></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Video className="h-4 w-4" />
                </Button>
                <div className="h-5 w-px bg-gray-700 mx-1"></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Code className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Add a description..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsSaved(false);
                }}
                className="min-h-[100px] bg-[#1A1A1A] border-0 rounded-none text-gray-200 resize-y"
              />
            </div>

            {/* Image Upload/Preview */}
            <div 
              className="border-2 border-dashed border-gray-700 rounded-md p-6 text-center cursor-pointer hover:border-gray-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
                <input
                  type="file"
                accept=".png,.jpeg,.jpg,.webp,.mp4,.webm"
                  multiple
                onChange={handleImageUpload}
                  className="hidden"
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center justify-center py-10">
                <ImageIcon className="h-16 w-16 text-gray-600 mb-4" />
                <p className="text-lg text-gray-300 mb-2">Drag images here or click to select files</p>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Attach up to 20 files. Videos cannot exceed 750 MB, 4K resolution, or 04 minutes (245 seconds) in
                  duration
                </p>
                <p className="text-sm text-blue-400 mt-4">
                  Accepted file types: .png, .jpeg, .jpg, .webp, .mp4, .webm
                </p>
              </div>
            </div>

            <div className="text-xs text-gray-400 mb-6">
              By uploading images to our site you agree to our Terms of service. Be sure to read our Content Policies before uploading any images.
                </div>

            {/* Edit/Preview Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-[#1A1A1A] border border-gray-800 rounded-md p-1">
                <TabsTrigger 
                  value="edit" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-sm"
                >
                  Edit
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-gray-800 data-[state=active]:text-white rounded-sm"
                >
                  Preview
                </TabsTrigger>
                  </TabsList>
            </Tabs>

            {/* Prompt Section */}
            <PromptSection
              selectedImage={selectedImage}
              clipSkip={clipSkip}
              steps={steps}
              sampler={sampler}
              seed={seed}
              togglePromptEdit={() => setIsPromptEditOpen(true)}
              updateImageProperty={updateImageProperty}
              setImages={setImages}
              setSelectedImageIndex={setSelectedImageIndex}
              title={title}
              description={description}
              images={images}
            />

            {/* Resources Section */}
            <ResourcesSection
              selectedImage={selectedImage}
              updateImageProperty={updateImageProperty}
              toggleDropdown={toggleDropdown}
            />

            {/* Tools Section */}
            <ToolsSection
              selectedImage={selectedImage}
              updateImageProperty={updateImageProperty}
              toggleDropdown={toggleDropdown}
            />

            {/* Techniques Section */}
            <TechniquesSection
              selectedImage={selectedImage}
              updateImageProperty={updateImageProperty}
              toggleDropdown={toggleDropdown}
            />

            {/* Tag Buttons */}
            <div className="py-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-yellow-600/20 text-yellow-400 border-yellow-800 hover:bg-yellow-600/30"
                onClick={() => handleAddTag("SEXY ATTIRE")}
              >
                🔥 SEXY ATTIRE
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-yellow-600/20 text-yellow-400 border-yellow-800 hover:bg-yellow-600/30"
                onClick={() => handleAddTag("SUGGESTIVE CONTENT")}
              >
                🔥 SUGGESTIVE CONTENT
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-700/50 text-gray-300 border-gray-700 hover:bg-gray-700/70"
                onClick={() => handleAddTag("NAVEL")}
              >
                👁️ NAVEL
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-700/50 text-gray-300 border-gray-700 hover:bg-gray-700/70"
                onClick={() => handleAddTag("TEXT")}
              >
                🔤 TEXT
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-700/50 text-gray-300 border-gray-700 hover:bg-gray-700/70"
                onClick={() => handleAddTag("SPORTSWEAR BOTTOMS")}
              >
                👚 SPORTSWEAR BOTTOMS
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-gray-700/50 text-gray-300 border-gray-700 hover:bg-gray-700/70"
                onClick={() => handleAddTag("SHIRT")}
              >
                👚 SHIRT
                      </Button>
                    </div>
          </div>

          {/* Right Column - Post Settings */}
          <div className="space-y-6">
            {/* Post Status */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-white">Post</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </div>
                {isSaved && <div className="text-green-500 text-xs font-semibold px-2 py-0.5 bg-green-900/20 rounded">SAVED</div>}
              </div>
              <p className="text-sm text-gray-400 mb-4">Your Post is currently <span className="text-gray-300 font-medium">{postStatus}</span></p>
              
              <div className="flex items-center gap-2 mb-2">
                <Button 
                  className="flex-grow bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handlePublish}
                >
                  Publish
                </Button>
                <Button variant="outline" size="icon" className="text-gray-300 border-gray-700">
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full text-red-500 border-red-800/50 hover:bg-red-900/20"
                onClick={handleDeletePost}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </Button>
            </div>

            {/* Image Preview */}
            {selectedImage ? (
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-md overflow-hidden sticky top-4">
                <div className="relative aspect-[3/4] max-h-[400px]">
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.title || "Image preview"}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  {selectedImage.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {selectedImage.tags.map((tag, idx) => (
                        <span key={idx} className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${selectedImageIndex <= 0 ? 'text-gray-600' : 'text-gray-300 hover:text-white'}`}
                        onClick={handlePrevImage}
                        disabled={selectedImageIndex <= 0}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <span className="text-gray-400 text-sm">
                        {selectedImageIndex + 1} / {images.length}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-8 w-8 ${selectedImageIndex >= images.length - 1 ? 'text-gray-600' : 'text-gray-300 hover:text-white'}`}
                        onClick={handleNextImage}
                        disabled={selectedImageIndex >= images.length - 1}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleRemoveImage(selectedImageIndex)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-md p-6 text-center">
                <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No image selected</p>
                <p className="text-sm text-gray-500 mt-2">Upload an image using the form on the left</p>
              </div>
            )}

            {/* Invite Collaborators */}
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-md p-4">
              <h3 className="text-lg font-medium text-white mb-3">Invite Collaborators</h3>
              <p className="text-sm text-gray-400 mb-4">
                Invite your teammates or collaborators to be shown on this post and get credit for it. If they accept
                the invite, it will be shown on their profile in addition to yours. Tipped Buzz will be split equally.
                A maximum of 15 collaborators can be invited.
              </p>
              <Input 
                placeholder="Select community members to invite as a collaborator"
                className="bg-[#232323] border-gray-700 text-gray-300 mb-2"
              />
            </div>
            
            {isAnalyzing && (
              <div className="bg-blue-900/30 border border-blue-800 text-blue-300 p-4 rounded-md flex items-center mt-4">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-300 border-t-transparent rounded-full"></div>
                Analyzing image
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 
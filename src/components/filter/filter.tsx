"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Camera,
  Brush,
  User,
  Building,
  Car,
  Dog,
  Plane,
  Mountain,
  PenTool,
  Coffee,
  Rocket,
  Cat,
  Bot,
  Gamepad,
  Skull,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Video as VideoIcon,
  Image as ImageIconAlt,
  Settings,
  Brain,
  Lightbulb,
  BookOpen,
  Instagram,
  MessageSquare,
  Calendar,
  Code,
  Smartphone,
  Server,
  Terminal,
  AppWindow,
  Cloud,
  Award,
  Users,
  Trophy,
  Target,
  Clock,
  Bot as AI
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const modelCategories = [
  { name: "ALL", icon: AI },
  { name: "Checkpoint", icon: Camera },
  { name: "Textual Inversion", icon: Brush },
  { name: "Hypernetwork", icon: User },
  { name: "Aesthetic Gradient", icon: Building },
  { name: "LORA", icon: Car },
  { name: "LoCon", icon: Dog },
  { name: "ControlNet", icon: Plane },
  { name: "Upscaler", icon: Mountain },
  { name: "Motion", icon: PenTool },
  { name: "Other", icon: Coffee }
]

const imageCategories = [
  { name: "ALL", icon: ImageIcon },
  { name: "COMICS", icon: PenTool },
  { name: "PHOTOGRAPHY", icon: Camera },
  { name: "COSTUME", icon: Brush },
  { name: "MAN", icon: User },
  { name: "ANIMAL", icon: Dog },
  { name: "ARMOR", icon: Skull },
  { name: "TRANSPORTATION", icon: Car },
  { name: "ARCHITECTURE", icon: Building },
  { name: "CITY", icon: Building },
  { name: "CARTOON", icon: PenTool },
  { name: "CAR", icon: Car },
  { name: "FOOD", icon: Coffee },
  { name: "ASTRONOMY", icon: Rocket },
  { name: "MODERN ART", icon: Brush },
  { name: "CAT", icon: Cat },
  { name: "ROBOT", icon: Bot },
  { name: "LANDSCAPE", icon: Mountain },
  { name: "DOG", icon: Dog },
  { name: "DRAGON", icon: Skull },
  { name: "FANTASY", icon: Gamepad },
  { name: "SPORTS CAR", icon: Car },
  { name: "POST APOCALYPTIC", icon: Skull },
  { name: "PHOTOREALISTIC", icon: Camera },
  { name: "CELEBRITY", icon: User },
  { name: "GAME CHARACTER", icon: Gamepad },
  { name: "SCI-FI", icon: Rocket },
]

const postCategories = [
  { name: "ALL", icon: MessageSquare },
  { name: "ComfyUI", icon: Settings },
  { name: "Plans", icon: Calendar },
  { name: "AI", icon: AI },
  { name: "Video", icon: VideoIcon },
  { name: "Image", icon: ImageIconAlt },
  { name: "Youtube", icon: Youtube },
  { name: "Tiktok", icon: VideoIcon },
  { name: "Instagram", icon: Instagram },
  { name: "Productivity", icon: Settings },
  { name: "Think", icon: Brain },
  { name: "Idea", icon: Lightbulb },
  { name: "Philosophy", icon: BookOpen }
]

const developmentCategories = [
  { name: "ALL", icon: Code },
  { name: "React", icon: Code },
  { name: "React-native", icon: Smartphone },
  { name: "Springboot", icon: Server },
  { name: "CursorAI", icon: Terminal },
  { name: "App", icon: AppWindow },
  { name: "MCP", icon: Cloud }
]

const challengeCategories = [
  { name: "ALL", icon: Trophy },
  { name: "Weekly", icon: Calendar },
  { name: "Monthly", icon: Calendar },
  { name: "Community", icon: Users },
  { name: "Beginner", icon: Target },
  { name: "Advanced", icon: Trophy },
  { name: "Time-Limited", icon: Clock },
  { name: "Theme", icon: Lightbulb },
  { name: "Style", icon: Brush },
  { name: "Technical", icon: Code }
]

interface FilterProps {
  type?: 'model' | 'image' | 'video' | 'post' | 'development' | 'challenge' | 'shop'
  onCategoryChange?: (category: string) => void
}

export function Filter({ type = 'model', onCategoryChange }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // URL에서 카테고리 정보를 가져옴
    return searchParams.get('category') || "ALL";
  });
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const categories = type === 'model' 
    ? modelCategories 
    : type === 'image' 
    ? imageCategories 
    : type === 'post'
    ? postCategories
    : type === 'development'
    ? developmentCategories
    : challengeCategories

  const handleCategoryChange = (category: string) => {
    // URL 업데이트
    const params = new URLSearchParams(searchParams.toString());
    if (category === "ALL") {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    // URL 변경
    router.push(`?${params.toString()}`);
    
    // 부모 컴포넌트 함수 호출
    onCategoryChange?.(category);
    // 로컬 상태 업데이트
    setSelectedCategory(category);
  }

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  let tableName: string
  switch (type) {
    case 'post':
      tableName = 'posts';
      break;
    case 'development':
      tableName = 'development_posts';
      break;
    case 'image':
      tableName = 'images';
      break;
    case 'video':
      tableName = 'videos';
      break;
    case 'model':
      tableName = 'ai_models'; // 나중에 생성할 예정
      break;
    case 'challenge':
      tableName = 'challenges';
      break;
    case 'shop':
      tableName = 'shop_items';
      break;
    default:
      tableName = 'posts';
  }

  return (
    <div className="relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* 왼쪽 화살표 */}
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90 shadow-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* 오른쪽 화살표 */}
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90 shadow-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* 카테고리 스크롤 */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto whitespace-nowrap pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={checkScroll}
      >
        <div className="flex w-full space-x-2 py-2">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-none transition-colors",
                selectedCategory === category.name
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-muted"
              )}
              onClick={() => handleCategoryChange(category.name)}
            >
              {(type === 'image' || type === 'post' || type === 'development') && 'icon' in category && (
                <category.icon className="mr-2 h-4 w-4" />
              )}
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 
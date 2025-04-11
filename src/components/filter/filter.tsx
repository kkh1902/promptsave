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
  ChevronRight
} from "lucide-react"

const modelCategories = [
  { name: "ALL", href: "#" },
  { name: "CHARACTER", href: "#" },
  { name: "STYLE", href: "#" },
  { name: "CELEBRITY", href: "#" },
  { name: "CONCEPT", href: "#" },
  { name: "CLOTHING", href: "#" },
  { name: "BASE MODEL", href: "#" },
  { name: "POSES", href: "#" },
  { name: "BACKGROUND", href: "#" },
  { name: "TOOL", href: "#" },
  { name: "VEHICLE", href: "#" },
  { name: "BUILDINGS", href: "#" },
  { name: "OBJECTS", href: "#" },
  { name: "ANIMAL", href: "#" },
  { name: "ASSETS", href: "#" },
  { name: "ACTION", href: "#" },
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

interface FilterProps {
  type: 'model' | 'image'
  onCategoryChange?: (category: string) => void
}

export function Filter({ type = 'model', onCategoryChange }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const categories = type === 'model' ? modelCategories : imageCategories

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
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
              {type === 'image' && 'icon' in category && (
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
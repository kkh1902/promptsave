"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthContext"
import {
  Search,
  Menu,
  ChevronDown,
  PenTool,
  LogIn,
  Home as HomeIcon,
  ShoppingBag,
  ImageIcon,
  Video,
  FileText,
  Trophy,
  Code,
  Bell,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CategoryNavigation } from "@/components/category/category-navigation"

// Navigation items
const navItems = [
  { name: "Home", icon: <HomeIcon className="w-4 h-4 mr-2" />, href: "/" },
  { name: "Models", icon: <PenTool className="w-4 h-4 mr-2" />, href: "/models" },
  { name: "Images", icon: <ImageIcon className="w-4 h-4 mr-2" />, href: "/images" },
  { name: "Videos", icon: <Video className="w-4 h-4 mr-2" />, href: "/videos" },
  { name: "Posts", icon: <FileText className="w-4 h-4 mr-2" />, href: "/posts" },
  { name: "Development", icon: <Code className="w-4 h-4 mr-2" />, href: "/development" },
  { name: "Challenges", icon: <Trophy className="w-4 h-4 mr-2" />, href: "/challenges" },
  { name: "Shop", icon: <ShoppingBag className="w-4 h-4 mr-2" />, href: "/shop" },
] as const

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const pathname = usePathname()

  console.log('로그인 상태:', isAuthenticated);
  console.log('사용자 정보:', user);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await logout()
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              CIVIT<span className="text-blue-500">AI</span>
            </span>
          </Link>
        </div>

        {/* Search with Models Dropdown */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex items-center w-full max-w-lg">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-2 text-base mr-2 transition-all duration-200 ease-in-out hover:bg-muted/80">
                  Models <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="transition-all duration-200">
                <DropdownMenuItem className="transition-colors duration-150 hover:bg-muted/80">Checkpoint</DropdownMenuItem>
                <DropdownMenuItem className="transition-colors duration-150 hover:bg-muted/80">LoRA</DropdownMenuItem>
                <DropdownMenuItem className="transition-colors duration-150 hover:bg-muted/80">LyCORIS</DropdownMenuItem>
                <DropdownMenuItem className="transition-colors duration-150 hover:bg-muted/80">Embeddings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200" />
              <Input
                type="search"
                placeholder="Search Civitai..."
                className="pl-10 w-full bg-muted/50 border-muted focus-visible:ring-primary/20 transition-all duration-200 ease-in-out hover:bg-muted/70 focus:bg-muted/80"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hidden md:flex transition-all duration-200 ease-in-out hover:bg-primary/90">
                <PenTool className="mr-2 h-4 w-4 transition-transform duration-200" />
                Create
                <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/create/image" className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Upload Image
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/create/video" className="flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  Upload Video
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/create/post" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center space-x-2">
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative hidden md:flex transition-all duration-200 ease-in-out hover:bg-muted/80">
                <Bell className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">1</span>
                <span className="sr-only">알림</span>
              </Button>
            </Link>

            <Link href={isAuthenticated ? "#" : "/login"} className="hidden md:block">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 hidden md:flex"
                onClick={handleAuth}
              >
                <LogIn className="h-4 w-4" />
                <span>{isAuthenticated ? "로그아웃" : "로그인"}</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    프로필
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login" className="w-full flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signout" className="w-full flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    회원 탈퇴
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-all duration-200 ease-in-out hover:bg-muted/80"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5 transition-transform duration-200" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t transition-all duration-300 ease-in-out">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center p-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
                    pathname === item.href
                      ? "bg-muted/80 text-foreground hover:bg-muted"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex justify-between">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full transition-all duration-200 ease-in-out hover:bg-muted/80">
                  <LogIn className="mr-2 h-4 w-4 transition-transform duration-200" />
                  로그인
                </Button>
              </Link>
            </div>
            <div className="mt-4 flex justify-between space-x-2">
              <Link href="/notifications" className="flex-1">
                <Button variant="outline" className="w-full transition-all duration-200 ease-in-out hover:bg-muted/80">
                  <Bell className="mr-2 h-4 w-4 transition-transform duration-200" />
                  알림
                </Button>
              </Link>
              <Link href="/profile" className="flex-1">
                <Button variant="outline" className="w-full transition-all duration-200 ease-in-out hover:bg-muted/80">
                  <User className="mr-2 h-4 w-4 transition-transform duration-200" />
                  프로필
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 
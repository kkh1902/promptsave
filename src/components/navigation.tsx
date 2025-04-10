"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 flex items-center">
          <Link href="#" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              CIVIT<span className="text-blue-500">AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2 text-base">
                Models <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Checkpoint</DropdownMenuItem>
              <DropdownMenuItem>LoRA</DropdownMenuItem>
              <DropdownMenuItem>LyCORIS</DropdownMenuItem>
              <DropdownMenuItem>Embeddings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-lg relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Civitai..."
              className="pl-10 bg-muted/50 border-muted focus-visible:ring-primary/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <LogIn className="h-5 w-5" />
            <span className="sr-only">Sign In</span>
          </Button>
          <Button className="hidden md:flex">
            <PenTool className="mr-2 h-4 w-4" />
            Create
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 hidden md:flex h-10 items-center border-t">
        <nav className="flex items-center space-x-4 w-full">
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-foreground bg-muted px-3 py-1.5 rounded-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <nav className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center p-2 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.href
                      ? "bg-muted text-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" className="w-full mr-2">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button className="w-full ml-2">
                <PenTool className="mr-2 h-4 w-4" />
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 
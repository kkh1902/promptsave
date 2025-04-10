import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home as HomeIcon,
  PenTool,
  ImageIcon,
  Video,
  FileText,
  Code,
  Trophy,
  ShoppingBag
} from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
}

export function CategoryNavigation() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: <HomeIcon className="h-4 w-4 mr-2" />,
    },
    {
      name: "Models",
      href: "/models",
      icon: <PenTool className="h-4 w-4 mr-2" />,
    },
    {
      name: "Images",
      href: "/images",
      icon: <ImageIcon className="h-4 w-4 mr-2" />,
    },
    {
      name: "Videos",
      href: "/videos",
      icon: <Video className="h-4 w-4 mr-2" />,
    },
    {
      name: "Posts",
      href: "/posts",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "Development",
      href: "/development",
      icon: <Code className="h-4 w-4 mr-2" />,
    },
    {
      name: "Challenges",
      href: "/challenges",
      icon: <Trophy className="h-4 w-4 mr-2" />,
    },
    {
      name: "Shop",
      href: "/shop",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 hidden md:flex h-10 items-center border-t">
      <nav className="flex items-center space-x-4 w-full">
        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center text-sm font-medium transition-all duration-200 ease-in-out ${
                pathname === item.href
                  ? "text-foreground bg-muted/80 hover:bg-muted px-3 py-1.5 rounded-md shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 px-3 py-1.5 rounded-md"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
} 
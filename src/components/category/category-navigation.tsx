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
  ShoppingBag,
  Users
} from "lucide-react"
import { FilterPopover } from "@/components/filter/filter-popover"
import { ReactionsPopover } from "@/components/filter/reactions-popover"
import { EveryonePopover } from "@/components/filter/everyone-popover"

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
    <div className="border-t border-border/40 bg-zinc-900/50">
      <div className="flex h-11 items-center px-6">
        <nav className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center text-sm font-medium transition-all duration-200 ease-in-out ${
                  pathname === item.href
                    ? "text-foreground bg-zinc-800/80 hover:bg-zinc-800 px-3 py-1.5 rounded-full shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 px-3 py-1.5 rounded-full"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <EveryonePopover />
            <ReactionsPopover />
            <FilterPopover />
          </div>
        </nav>
      </div>
    </div>
  )
} 
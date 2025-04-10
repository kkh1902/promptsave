import { Award } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BannerProps {
  title: string
  description: string
  buttonText: string
  icon?: React.ReactNode
}

export function Banner({ title, description, buttonText, icon }: BannerProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="relative rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
            {icon || <Award className="h-8 w-8 text-amber-500" />}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground max-w-3xl">
              {description}
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
} 
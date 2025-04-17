import { Award, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface BannerProps {
  title: string
  description: string
  buttonText: string
  icon?: React.ReactNode
}

export function Banner({ title, description, buttonText, icon }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="relative rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 p-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gray-800 flex items-center justify-center">
            {icon || <Award className="h-7 w-7 text-amber-500" />}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1">{title}</h2>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-4 md:mt-0">
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
} 
"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterOption {
  label: string
  options: string[]
}

const filterOptions: FilterOption[] = [
  {
    label: "Time period",
    options: ["Day", "Week", "Month", "Year", "All Time"]
  },
  {
    label: "Base model",
    options: [
      "SD 1.4", "SD 1.5", "SD 1.5 LCM", "SD 1.5 Hyper",
      "SD 2.0", "SD 2.1", "SDXL 1.0", "SD 3", "SD 3.5",
      "SD 3.5 Medium", "SD 3.5 Large", "SD 3.5 Large Turbo",
      "Pony", "Flux.1.S", "Flux.1.D", "AuraFlow",
      "SDXL Lightning", "SDXL Hyper", "SVD", "PixArt a",
      "PixArt E", "Hunyuan 1", "Hunyuan Video", "Lumina",
      "Kolors", "Illustrious", "Mochi", "LTXV",
      "CogVideoX", "NoobAI", "Wan Video", "Other"
    ]
  },
  {
    label: "Media type",
    options: ["image", "video"]
  },
  {
    label: "Modifiers",
    options: ["Metadata only", "Hidden", "Made On-site", "Originals Only", "Remixes Only"]
  },
  {
    label: "Tools",
    options: []
  },
  {
    label: "Techniques",
    options: []
  }
]

export function FilterPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out">
          Filters
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0 bg-[#1c1c1c] border-zinc-800" align="end">
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-6">
            {filterOptions.map((section) => (
              <div key={section.label} className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-400">{section.label}</h4>
                {section.options.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {section.options.map((option) => (
                      <Button
                        key={option}
                        variant="ghost"
                        className={cn(
                          "h-9 justify-start text-left font-normal bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300",
                          option === "Week" && "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
                          option === "image" && "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        )}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="h-9 px-3 flex items-center rounded-md bg-zinc-800/50">
                    <input 
                      type="text" 
                      placeholder="Created with..."
                      className="w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-500 border-none outline-none"
                    />
                  </div>
                )}
              </div>
            ))}
            <Button className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-300" variant="ghost">
              Clear all filters
            </Button>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
} 
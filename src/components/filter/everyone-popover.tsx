"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Users, ChevronDown } from "lucide-react"

const everyoneOptions = [
  "Followed",
  "Everyone"
]

export function EveryonePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-800/50 px-3 py-1.5 rounded-full transition-all duration-200 ease-in-out">
          <Users className="h-4 w-4 mr-1" />
          Everyone
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="space-y-1">
          {everyoneOptions.map((option) => (
            <Button
              key={option}
              variant="ghost"
              className="w-full justify-start text-left font-normal hover:bg-zinc-800/50"
            >
              {option}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
} 
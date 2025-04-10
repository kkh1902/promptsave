"use client"

import { X } from "lucide-react"
import Image from "next/image"

interface AnnouncementBannerProps {
  onClose: () => void
}

export function AnnouncementBanner({ onClose }: AnnouncementBannerProps) {
  return (
    <div className="border-b border-[#2A2A2A] bg-[#1A1A1A]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Image
            src="/gavel.png"
            alt="Auction"
            width={40}
            height={40}
            className="rounded bg-[#2A2A2A]"
          />
          <div className="flex-1">
            <h3 className="text-base font-medium">Auction System Re-Launched!</h3>
            <p className="text-sm text-gray-400">
              Today, we're reintroducing the Auction System with a more focused approach.
              <button className="text-blue-400 hover:text-blue-300 ml-1">Read more!</button>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
} 
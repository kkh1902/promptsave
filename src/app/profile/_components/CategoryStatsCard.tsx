"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  ImageIcon,
  Video,
  Cpu,
  MessageSquare,
} from "lucide-react"

// Props 타입 정의
interface CategoryStatsCardProps {
  userPostsCount: number;
  userImagesCount: number;
  userVideosCount: number;
  userModelsCount: number;
  userCommentsCount: number;
}

export function CategoryStatsCard({
  userPostsCount,
  userImagesCount,
  userVideosCount,
  userModelsCount,
  userCommentsCount
}: CategoryStatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">콘텐츠 통계</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm">포스트</span>
            </div>
            <span className="text-sm font-medium">{userPostsCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm">이미지</span>
            </div>
            <span className="text-sm font-medium">{userImagesCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-orange-500" />
              <span className="text-sm">비디오</span>
            </div>
            <span className="text-sm font-medium">{userVideosCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-purple-500" />
              <span className="text-sm">모델</span>
            </div>
            <span className="text-sm font-medium">{userModelsCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-pink-500" />
              <span className="text-sm">댓글</span>
            </div>
            <span className="text-sm font-medium">{userCommentsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
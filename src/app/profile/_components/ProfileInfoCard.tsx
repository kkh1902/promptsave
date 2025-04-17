"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ExternalLink,
  Settings,
  UserCheck,
  UserPlus,
} from "lucide-react"

// Props 타입 정의
interface ProfileInfoCardProps {
  userData: any; // 실제 데이터 타입으로 교체하는 것이 좋습니다
  currentUser: any; // 실제 데이터 타입으로 교체하는 것이 좋습니다
  isFollowing: boolean;
  handleFollowToggle: () => void;
  userFollowers: any[]; // 실제 데이터 타입으로 교체하는 것이 좋습니다
  userFollowings: any[]; // 실제 데이터 타입으로 교체하는 것이 좋습니다
  userPosts: any[];
  userImages: any[];
  userVideos: any[];
  userModels: any[];
}

export function ProfileInfoCard({ 
  userData, 
  currentUser, 
  isFollowing, 
  handleFollowToggle, 
  userFollowers, 
  userFollowings,
  userPosts,
  userImages,
  userVideos,
  userModels
}: ProfileInfoCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* 커버 이미지 */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {userData.cover_image && (
          <Image
            src={userData.cover_image}
            alt={`${userData.username || '사용자'}의 커버 이미지`}
            fill
            className="object-cover"
          />
        )}
      </div>
      
      <CardContent className="pt-0">
        {/* 프로필 이미지 및 기본 정보 */}
        <div className="flex flex-col items-center -mt-10 mb-4">
          <Avatar className="h-20 w-20 border-4 border-background mb-3">
            <AvatarImage src={userData.avatar_url || "/placeholder.svg"} alt={userData.username || '사용자'} />
            <AvatarFallback className="text-2xl">{userData.username?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold">{userData.username || '익명 사용자'}</h1>
              {userData?.verified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  인증됨
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              가입일: {new Date(userData.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* 사용자 웹사이트 */}
        {userData.website && (
          <div className="mb-4 text-center">
            <a
              href={userData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-500 hover:underline justify-center"
            >
              <ExternalLink className="h-3 w-3" />
              {userData.website}
            </a>
          </div>
        )}
        
        {/* 통계 */}
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-muted/40 rounded-md p-2">
            <div className="font-medium">{userFollowers.length}</div>
            <div className="text-xs text-muted-foreground">팔로워</div>
          </div>
          <div className="bg-muted/40 rounded-md p-2">
            <div className="font-medium">{userFollowings.length}</div>
            <div className="text-xs text-muted-foreground">팔로잉</div>
          </div>
          <div className="bg-muted/40 rounded-md p-2">
            <div className="font-medium">{userPosts.length + userImages.length + userVideos.length + userModels.length}</div>
            <div className="text-xs text-muted-foreground">게시물</div>
          </div>
        </div>
        
        {/* 액션 버튼 */}
        {currentUser && currentUser.id !== userData.id ? (
          <Button 
            onClick={handleFollowToggle}
            variant={isFollowing ? "outline" : "default"}
            className="w-full gap-1"
          >
            {isFollowing ? (
              <>
                <UserCheck className="h-4 w-4" />
                팔로잉
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                팔로우
              </>
            )}
          </Button>
        ) : currentUser && (
          <Button variant="outline" className="w-full gap-1">
            <Settings className="h-4 w-4" />
            프로필 편집
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 
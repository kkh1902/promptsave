"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  FileText,
  ImageIcon,
  Video,
  Cpu,
  MessageSquare,
  User,
  Users,
} from "lucide-react"
import { Filter } from "@/components/filter/filter"
import { GalleryGrid } from "@/components/gallery/gallery-grid"

// Props 타입 정의
interface ProfileContentTabsProps {
  userPosts: any[];
  userImages: any[];
  userVideos: any[];
  userModels: any[];
  userComments: any[];
  userFollowings: any[];
  userFollowers: any[];
  currentUser: any;
  onDeleteItem?: (itemId: string, itemType: string) => Promise<any>;
  onEditItem?: (itemId: string, itemType: string) => void;
  handleCategoryChange: (category: string) => void;
}

export function ProfileContentTabs({ 
  userPosts, 
  userImages, 
  userVideos, 
  userModels, 
  userComments, 
  userFollowings, 
  userFollowers, 
  currentUser,
  onDeleteItem,
  onEditItem,
  handleCategoryChange
}: ProfileContentTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  // 탭별 콘텐츠 렌더링 로직
  const renderTabContent = () => {
    const galleryProps = { currentUser, onDeleteItem, onEditItem };
    switch (activeTab) {
      case "posts":
        return <GalleryGrid items={userPosts.map(item => ({ ...item, type: 'post' }))} {...galleryProps} />;
      case "images":
        return <GalleryGrid items={userImages.map(item => ({ ...item, type: 'image' }))} {...galleryProps} />;
      case "videos":
        return <GalleryGrid items={userVideos.map(item => ({ ...item, type: 'video' }))} {...galleryProps} />;
      case "models":
        return <GalleryGrid items={userModels.map(item => ({ ...item, type: 'model' }))} {...galleryProps} />;
      case "comments":
        return (
          <div className="space-y-4">
            {userComments.length > 0 ? (
              userComments.map((comment) => (
                <Card key={comment.id} className="bg-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          댓글 달린 콘텐츠: {" "}
                          {comment.posts?.title || 
                           comment.images?.title || 
                           comment.videos?.title || 
                           comment.ai_models?.title || 
                           '삭제된 콘텐츠'}
                        </p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                댓글이 없습니다.
              </div>
            )}
          </div>
        );
      case "following":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userFollowings.length > 0 ? (
              userFollowings.map((follow) => (
                <Card key={follow.following_id} className="bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={follow.profiles?.avatar_url || "/placeholder.svg"} alt={follow.profiles?.username || '사용자'} />
                        <AvatarFallback>{follow.profiles?.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{follow.profiles?.username || '사용자'}</h3>
                        <p className="text-xs text-muted-foreground">{follow.profiles?.bio?.substring(0, 30) || '소개 없음'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground col-span-full">
                팔로우한 사용자가 없습니다.
              </div>
            )}
          </div>
        );
      case "followers":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userFollowers.length > 0 ? (
              userFollowers.map((follow) => (
                <Card key={follow.follower_id} className="bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={follow.profiles?.avatar_url || "/placeholder.svg"} alt={follow.profiles?.username || '사용자'} />
                        <AvatarFallback>{follow.profiles?.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{follow.profiles?.username || '사용자'}</h3>
                        <p className="text-xs text-muted-foreground">{follow.profiles?.bio?.substring(0, 30) || '소개 없음'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground col-span-full">
                팔로워가 없습니다.
              </div>
            )}
          </div>
        );
      default:
        return <div>콘텐츠를 불러올 수 없습니다.</div>;
    }
  };

  return (
    <div className="flex-1">
      <Filter type="post" onCategoryChange={handleCategoryChange} />
      
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            포스트 <span className="text-xs">({userPosts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            이미지 <span className="text-xs">({userImages.length})</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="h-4 w-4" />
            비디오 <span className="text-xs">({userVideos.length})</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-2">
            <Cpu className="h-4 w-4" />
            모델 <span className="text-xs">({userModels.length})</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            댓글 <span className="text-xs">({userComments.length})</span>
          </TabsTrigger>
          <TabsTrigger value="following" className="gap-2">
            <User className="h-4 w-4" />
            팔로잉 <span className="text-xs">({userFollowings.length})</span>
          </TabsTrigger>
          <TabsTrigger value="followers" className="gap-2">
            <Users className="h-4 w-4" />
            팔로워 <span className="text-xs">({userFollowers.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {renderTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
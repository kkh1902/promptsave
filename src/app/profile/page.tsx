"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation/navigation"
import { CategoryNavigation } from "@/components/category/category-navigation"
import { Banner } from "@/components/banner/banner"
import { Footer } from "@/components/footer/footer"
import { ProfileInfoCard } from "@/app/profile/_components/ProfileInfoCard"
import { CategoryStatsCard } from "@/app/profile/_components/CategoryStatsCard"
import { ProfileContentTabs } from "@/app/profile/_components/ProfileContentTabs"
import { useCurrentUser } from "@/hooks/profile/useCurrentUser"
import { useUserProfile } from "@/hooks/profile/useUserProfile"
import { useFollowUser } from "@/hooks/profile/useFollowUser"

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('id');
  const initialCategory = searchParams.get('category') || "ALL";
  
  // 페이지 레벨 상태 (URL 파라미터, 카테고리 선택)
  const [userId, setUserId] = useState(initialUserId);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // 커스텀 훅 사용
  const { currentUser, isLoadingCurrentUser } = useCurrentUser();
  
  // 로그인한 사용자의 프로필 페이지인 경우 URL 파라미터 대신 currentUser.id 사용
  // useCurrentUser 훅이 로딩 중일 때는 initialUserId를 유지
  const profileUserId = !initialUserId && !isLoadingCurrentUser && currentUser ? currentUser.id : userId;

  const { 
    userData, 
    userPosts, 
    userImages, 
    userVideos, 
    userModels, 
    userComments, 
    userFollowings, 
    userFollowers, 
    isLoadingProfile, 
    profileError,
    isFollowingInitial,
    deleteContentItem
  } = useUserProfile({ userId: profileUserId, currentUser });
  
  const { 
    isFollowing, 
    handleFollowToggle,
    isSubmittingFollow 
  } = useFollowUser({ currentUser, targetUserId: profileUserId, initialIsFollowing: isFollowingInitial });

  // useState 훅은 초기값만 인자로 받습니다.
  // useEffect로 currentUser 변경 시 userId를 업데이트합니다.
  useEffect(() => {
    if (!initialUserId && !isLoadingCurrentUser && currentUser) {
      setUserId(currentUser.id);
    }
  }, [initialUserId, isLoadingCurrentUser, currentUser]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // 필요하다면 URL 업데이트 로직 추가
  };

  // 수정 페이지로 이동하는 함수
  const handleEditItem = (itemId: string, itemType: string) => {
    // itemType에 따라 적절한 수정 페이지 경로 생성
    // 예시: /post/123/edit, /image/abc/edit 등
    const editUrl = `/${itemType}/${itemId}/edit`; 
    router.push(editUrl);
  };

  // 로딩 상태 처리 (두 훅 모두 완료될 때까지)
  const isLoading = isLoadingCurrentUser || isLoadingProfile;
  const error = profileError; // 에러는 useUserProfile에서 가져옴

  // 현재 프로필이 내 프로필인지 확인
  const isMyProfile = currentUser?.id === profileUserId;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">프로필 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  
  if (error || !userData) {
    return (
      <div className="flex min-h-screen bg-background flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h2 className="text-2xl font-bold text-red-500 mb-2">오류 발생</h2>
            <p className="text-muted-foreground mb-4">{error || '사용자 정보를 찾을 수 없습니다.'}</p>
            <Button variant="outline" onClick={() => window.history.back()}>돌아가기</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background flex-col">
      <Navigation />
      <CategoryNavigation 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        type="post"
      />
      
      <Banner
        title={`${userData.username || '사용자'} 프로필`}
        description={userData.bio || "사용자의 콘텐츠와 활동을 확인하세요."}
        buttonText="콘텐츠 보기"
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 왼쪽 프로필 정보 */}
          <div className="md:w-80 lg:w-96 shrink-0 space-y-4">
            <ProfileInfoCard
              userData={userData}
              currentUser={currentUser}
              isFollowing={isFollowing} 
              handleFollowToggle={handleFollowToggle} 
              userFollowers={userFollowers}
              userFollowings={userFollowings}
              userPosts={userPosts}
              userImages={userImages}
              userVideos={userVideos}
              userModels={userModels}
              // isSubmittingFollow prop 추가 가능 (버튼 비활성화 등)
            />
            <CategoryStatsCard 
              userPostsCount={userPosts.length}
              userImagesCount={userImages.length}
              userVideosCount={userVideos.length}
              userModelsCount={userModels.length}
              userCommentsCount={userComments.length}
            />
          </div>
          
          {/* 오른쪽 콘텐츠 영역 */}
          <ProfileContentTabs 
            userPosts={userPosts}
            userImages={userImages}
            userVideos={userVideos}
            userModels={userModels}
            userComments={userComments}
            userFollowings={userFollowings}
            userFollowers={userFollowers}
            handleCategoryChange={handleCategoryChange}
            currentUser={currentUser}
            onDeleteItem={isMyProfile ? deleteContentItem : undefined}
            onEditItem={isMyProfile ? handleEditItem : undefined}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 
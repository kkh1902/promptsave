"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UseUserProfileParams {
  userId: string | null;
  currentUser: any; // 실제 타입으로 교체 권장
}

export function useUserProfile({ userId, currentUser }: UseUserProfileParams) {
  const [userData, setUserData] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userImages, setUserImages] = useState<any[]>([]);
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [userModels, setUserModels] = useState<any[]>([]);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [userFollowings, setUserFollowings] = useState<any[]>([]);
  const [userFollowers, setUserFollowers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowingInitial, setIsFollowingInitial] = useState(false);

  // 삭제 함수 추가
  const deleteContentItem = async (itemId: string, itemType: string) => {
    let tableName = '';
    let stateUpdater: React.Dispatch<React.SetStateAction<any[]>> | null = null;

    switch (itemType) {
      case 'post':
        tableName = 'posts';
        stateUpdater = setUserPosts;
        break;
      case 'image':
        tableName = 'images';
        stateUpdater = setUserImages;
        break;
      case 'video':
        tableName = 'videos';
        stateUpdater = setUserVideos;
        break;
      case 'model':
        tableName = 'ai_models';
        stateUpdater = setUserModels;
        break;
      default:
        console.error('Unknown item type:', itemType);
        return { success: false, error: '알 수 없는 콘텐츠 타입' };
    }

    try {
      // 본인 콘텐츠인지 확인 (user_id 필드 기준)
      const { data: itemData, error: fetchError } = await supabase
        .from(tableName)
        .select('user_id')
        .eq('id', itemId)
        .single();

      if (fetchError || !itemData) {
        throw new Error('콘텐츠 정보를 가져올 수 없습니다.');
      }

      if (itemData.user_id !== currentUser?.id) {
        throw new Error('삭제 권한이 없습니다.');
      }

      // 삭제 실행
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemId);

      if (deleteError) {
        throw deleteError;
      }

      // 로컬 상태 업데이트
      if (stateUpdater) {
        stateUpdater(prevItems => prevItems.filter(item => item.id !== itemId));
      }
      
      return { success: true };

    } catch (error: any) {
      console.error(`Error deleting ${itemType} (${itemId}):`, error);
      return { success: false, error: error.message || '삭제 중 오류 발생' };
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!userId) {
        if (isMounted) setIsLoading(false);
        return;
      }
      
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }
        
        // 병렬 쿼리 준비 (ProfilePage에서 가져옴)
        const profileQuery = supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        let followQuery = null;
        if (currentUser) {
          followQuery = supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUser.id)
            .eq('following_id', userId)
            .single();
        }
        
        const postsQuery = supabase.from('posts').select('*').eq('user_id', userId).eq('status', 'published').order('created_at', { ascending: false });
        const imagesQuery = supabase.from('images').select('*').eq('user_id', userId).eq('status', 'published').order('created_at', { ascending: false });
        const videosQuery = supabase.from('videos').select('*').eq('user_id', userId).eq('status', 'published').order('created_at', { ascending: false });
        const modelsQuery = supabase.from('ai_models').select('*').eq('user_id', userId).eq('status', 'published').order('created_at', { ascending: false });
        const commentsQuery = supabase.from('comments').select('*, posts(*), images(*), videos(*), ai_models(*)').eq('user_id', userId).order('created_at', { ascending: false });
        const followingsQuery = supabase.from('follows').select('following_id, profiles!follows_following_id_fkey(*)').eq('follower_id', userId);
        const followersQuery = supabase.from('follows').select('follower_id, profiles!follows_follower_id_fkey(*)').eq('following_id', userId);
        
        const queryPromises = [
          profileQuery,
          postsQuery,
          imagesQuery,
          videosQuery,
          modelsQuery,
          commentsQuery,
          followingsQuery,
          followersQuery
        ];
        
        if (followQuery) {
          queryPromises.push(followQuery);
        }
        
        const results = await Promise.all(queryPromises);
        
        if (!isMounted) return; // 컴포넌트 언마운트 시 중단
        
        const [
          profileResult,
          postsResult,
          imagesResult,
          videosResult,
          modelsResult,
          commentsResult,
          followingsResult,
          followersResult,
          ...rest
        ] = results;
        
        const followResult = followQuery ? rest[0] : null;
        
        if (profileResult.error) {
          console.error('프로필 조회 오류:', profileResult.error);
          setError('사용자 정보를 불러오는데 실패했습니다.');
          setIsLoading(false);
          return;
        }
        
        if (!profileResult.data) {
          setError('사용자를 찾을 수 없습니다.');
          setIsLoading(false);
          return;
        }
        
        setUserData(profileResult.data);
        if (followResult) {
          setIsFollowingInitial(!!followResult.data);
        }
        setUserPosts(postsResult.data || []);
        setUserImages(imagesResult.data || []);
        setUserVideos(videosResult.data || []);
        setUserModels(modelsResult.data || []);
        setUserComments(commentsResult.data || []);
        setUserFollowings(followingsResult.data || []);
        setUserFollowers(followersResult.data || []);
        
        setIsLoading(false);
      } catch (err) {
        if (isMounted) {
          console.error('사용자 데이터 가져오기 중 오류 발생:', err);
          setError('데이터를 불러오는 중 오류가 발생했습니다.');
          setIsLoading(false);
        }
      }
    };
    
    fetchUserData();

    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, [userId, currentUser]); // userId 또는 currentUser 변경 시 재실행

  return {
    userData,
    userPosts,
    userImages,
    userVideos,
    userModels,
    userComments,
    userFollowings,
    userFollowers,
    isLoadingProfile: isLoading,
    profileError: error,
    isFollowingInitial,
    deleteContentItem
  };
} 
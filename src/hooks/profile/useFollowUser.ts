"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner"; // 토스트 메시지 사용

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface UseFollowUserParams {
  currentUser: any; // 실제 타입으로 교체 권장
  targetUserId: string | null;
  initialIsFollowing: boolean;
}

export function useFollowUser({ currentUser, targetUserId, initialIsFollowing }: UseFollowUserParams) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // initialIsFollowing 값이 변경되면 isFollowing 상태 업데이트
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    if (!currentUser || !targetUserId) {
      toast.error('팔로우/언팔로우를 하려면 로그인이 필요합니다.');
      return;
    }

    if (isSubmitting) return; // 중복 제출 방지
    setIsSubmitting(true);

    try {
      if (isFollowing) {
        // 언팔로우
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', targetUserId);
          
        if (error) throw error;
        
        setIsFollowing(false);
        toast.success('언팔로우했습니다.');
      } else {
        // 팔로우
        const { error } = await supabase
          .from('follows')
          .insert([
            { follower_id: currentUser.id, following_id: targetUserId }
          ]);
          
        if (error) throw error;
        
        setIsFollowing(true);
        toast.success('팔로우했습니다.');
      }
    } catch (err: any) {
      console.error('팔로우 상태 변경 중 오류:', err);
      toast.error(`팔로우 상태 변경 실패: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isFollowing, handleFollowToggle, isSubmittingFollow: isSubmitting };
} 
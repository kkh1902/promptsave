"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화 (환경 변수에서 가져오기)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // 컴포넌트 마운트 상태 추적

    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('현재 사용자 정보 가져오기 오류:', error);
          if (isMounted) setCurrentUser(null);
          return;
        }
        
        if (user && isMounted) {
          // 프로필 정보 가져오기
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!profileError && profile) {
            setCurrentUser({ ...user, ...profile });
          } else {
            // 프로필 정보가 없어도 기본 auth user 정보는 설정
            setCurrentUser(user);
            if(profileError) console.error('현재 사용자 프로필 가져오기 오류:', profileError);
          }
        } else if (isMounted) {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('현재 사용자 정보 가져오기 중 예외 발생:', err);
        if (isMounted) setCurrentUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchCurrentUser();

    // 클린업 함수: 컴포넌트 언마운트 시 상태 업데이트 방지
    return () => {
      isMounted = false;
    };
  }, []);

  return { currentUser, isLoadingCurrentUser: isLoading };
} 
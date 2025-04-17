import { supabase } from "./supabase";

// 회원가입 타입 정의
export interface RegisterOptions {
  email: string;
  password: string;
  redirectTo?: string;
  metadata?: { [key: string]: any };
  username?: string;
  avatar_url?: string;
  bio?: string;
}

// 회원가입 결과 타입
export interface AuthResult {
  success: boolean;
  user?: any;
  error?: string;
  message?: string;
}

/**
 * 회원가입 함수
 */
export async function registerUser(options: RegisterOptions): Promise<AuthResult> {
  const { email, password, redirectTo, metadata, username, avatar_url, bio } = options;
  
  try {
    // 이메일 및 비밀번호 유효성 검사
    if (!email || !password) {
      return { success: false, error: "이메일과 비밀번호를 모두 입력해주세요." };
    }

    if (password.length < 6) {
      return { success: false, error: "비밀번호는 최소 6자 이상이어야 합니다." };
    }
    
    // Supabase 회원가입 요청
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        data: metadata
      }
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return { success: false, error: "이미 등록된 이메일입니다." };
      }
      return { success: false, error: error.message };
    }

    if (data?.user) {
      // 사용자 테이블에 프로필 정보 추가
      try {
        const userId = data.user.id;
        const { error: userError } = await supabase
          .from('users') // users 테이블에 사용자 정보 저장
          .insert([
            { 
              id: userId,
              username: username || email.split('@')[0], // 기본 사용자명은 이메일 주소에서 추출
              email: email,
              created_at: new Date().toISOString()
            }
          ]);
          
        if (userError) {
          console.error('사용자 정보 저장 오류:', userError);
          // 사용자 정보 저장 실패 시에도 회원가입은 성공으로 처리
        }
      } catch (profileErr) {
        console.error('사용자 정보 생성 중 예외 발생:', profileErr);
      }
      
      return { 
        success: true, 
        user: data.user, 
        message: "확인 이메일이 발송되었습니다. 이메일을 확인해주세요." 
      };
    }
    
    return { success: false, error: "회원가입 중 오류가 발생했습니다." };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message || "회원가입 중 오류가 발생했습니다." };
  }
}

/**
 * 회원 탈퇴 함수
 */
export async function deleteAccount(): Promise<AuthResult> {
  try {
    // 현재 사용자 가져오기
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: "로그인 정보를 찾을 수 없습니다." };
    }
    
    // 사용자 관련 데이터 삭제
    try {
      // 1. 사용자의 게시물(posts) 삭제
      const { error: postsDeleteError } = await supabase
        .from('posts')
        .delete()
        .eq('user_id', user.id);
        
      if (postsDeleteError) {
        console.error('게시물 삭제 오류:', postsDeleteError);
      }
      
      // 2. 사용자의 이미지 데이터(images) 삭제 - 테이블이 있는 경우
      try {
        const { error: imagesDeleteError } = await supabase
          .from('images')
          .delete()
          .eq('user_id', user.id);
          
        if (imagesDeleteError) {
          console.error('이미지 데이터 삭제 오류:', imagesDeleteError);
        }
      } catch (err) {
        // 테이블이 없을 수 있으므로 오류 무시
      }
      
      // 3. 사용자의 비디오 데이터(videos) 삭제 - 테이블이 있는 경우
      try {
        const { error: videosDeleteError } = await supabase
          .from('videos')
          .delete()
          .eq('user_id', user.id);
          
        if (videosDeleteError) {
          console.error('비디오 데이터 삭제 오류:', videosDeleteError);
        }
      } catch (err) {
        // 테이블이 없을 수 있으므로 오류 무시
      }
      
      // 4. 사용자의 모델 데이터(ai_models) 삭제 - 테이블이 있는 경우
      try {
        const { error: modelsDeleteError } = await supabase
          .from('ai_models')
          .delete()
          .eq('user_id', user.id);
          
        if (modelsDeleteError) {
          console.error('모델 데이터 삭제 오류:', modelsDeleteError);
        }
      } catch (err) {
        // 테이블이 없을 수 있으므로 오류 무시
      }
      
      // 5. 사용자의 댓글(comments) 삭제 - 테이블이 있는 경우
      try {
        const { error: commentsDeleteError } = await supabase
          .from('comments')
          .delete()
          .eq('user_id', user.id);
          
        if (commentsDeleteError) {
          console.error('댓글 데이터 삭제 오류:', commentsDeleteError);
        }
      } catch (err) {
        // 테이블이 없을 수 있으므로 오류 무시
      }
      
      // 6. 사용자의 팔로우/팔로워 관계(follows) 삭제 - 테이블이 있는 경우
      try {
        const { error: followsDeleteError } = await supabase
          .from('follows')
          .delete()
          .or(`follower_id.eq.${user.id},following_id.eq.${user.id}`);
          
        if (followsDeleteError) {
          console.error('팔로우 데이터 삭제 오류:', followsDeleteError);
        }
      } catch (err) {
        // 테이블이 없을 수 있으므로 오류 무시
      }
      
      // 7. users 테이블의 사용자 정보 삭제
      const { error: usersDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);
        
      if (usersDeleteError) {
        console.error('사용자 정보 삭제 오류:', usersDeleteError);
      }
    } catch (err) {
      console.error('사용자 관련 데이터 삭제 중 오류:', err);
    }
    
    // 사용자 계정 삭제 시도 (관리자 API)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      // admin 메서드 실패 시 자체 계정 삭제 API 사용
      const { error: selfDeleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (selfDeleteError) {
        return { 
          success: false, 
          error: `계정 삭제 중 오류가 발생했습니다: ${selfDeleteError.message}` 
        };
      }
    }
    
    // 로그아웃
    await supabase.auth.signOut();
    
    return { 
      success: true, 
      message: "계정이 성공적으로 삭제되었습니다." 
    };
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return { 
      success: false, 
      error: error.message || "계정 삭제 중 오류가 발생했습니다." 
    };
  }
}

/**
 * 로그인 함수
 */
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    if (!email || !password) {
      return { success: false, error: "이메일과 비밀번호를 모두 입력해주세요." };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (data?.user) {
      return { success: true, user: data.user };
    }
    
    return { success: false, error: "로그인 중 오류가 발생했습니다." };
  } catch (error: any) {
    console.error("Login error:", error);
    return { success: false, error: error.message || "로그인 중 오류가 발생했습니다." };
  }
}

/**
 * 로그아웃 함수
 */
export async function logoutUser(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, message: "로그아웃 되었습니다." };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, error: error.message || "로그아웃 중 오류가 발생했습니다." };
  }
}

/**
 * 비밀번호 재설정 이메일 발송
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    if (!email) {
      return { success: false, error: "이메일을 입력해주세요." };
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      message: "비밀번호 재설정 이메일이 발송되었습니다." 
    };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { 
      success: false, 
      error: error.message || "비밀번호 재설정 이메일 발송 중 오류가 발생했습니다." 
    };
  }
}

/**
 * 현재 사용자 가져오기
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Get user error:", error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
} 
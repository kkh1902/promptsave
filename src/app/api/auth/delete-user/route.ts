import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// 서비스 역할 키를 사용한 클라이언트 설정
// 참고: 이는 서버 측에서만 사용되어야 함
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: Request) {
  // 요청 바디에서 userId 추출
  const { userId } = await request.json()
  
  if (!userId) {
    return NextResponse.json(
      { error: '사용자 ID가 제공되지 않았습니다.' },
      { status: 400 }
    )
  }
  
  try {
    // 쿠키 기반 클라이언트 - 현재 사용자 세션 확인용
    const supabase = createRouteHandlerClient({ cookies })
    
    // 현재 로그인한 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다. 로그인이 필요합니다.' },
        { status: 401 }
      )
    }
    
    // 보안 강화: 현재 로그인한 사용자의 ID와 삭제하려는 ID가 일치하는지 확인
    // 관리자 페이지는 별도 경로 /admin/auth/delete-user로 구현해야 함
    if (userId !== user.id) {
      return NextResponse.json(
        { error: '자신의 계정만 삭제할 수 있습니다.' },
        { status: 403 }
      )
    }
    
    // 사용자 데이터 삭제 (데이터베이스에서 관련 레코드 제거)
    
    // 프로필 데이터 삭제
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (profileDeleteError) {
      console.error('프로필 삭제 오류:', profileDeleteError)
    }
    
    // 팔로우 관계 데이터 삭제
    const { error: followsDeleteError } = await supabase
      .from('follows')
      .delete()
      .or(`follower_id.eq.${userId},following_id.eq.${userId}`)
    
    if (followsDeleteError) {
      console.error('팔로우 데이터 삭제 오류:', followsDeleteError)
    }
    
    // 이 부분에서 posts, images, videos, models, comments 등의 추가 데이터 삭제 구현
    // 예시:
    for (const table of ['posts', 'images', 'videos', 'ai_models', 'comments']) {
      const { error: tableError } = await supabase
        .from(table)
        .delete()
        .eq('user_id', userId)
      
      if (tableError) {
        console.error(`${table} 테이블 데이터 삭제 오류:`, tableError)
      }
    }
    
    // 서비스 역할 키를 사용하여 사용자 삭제
    const { createClient } = await import('@supabase/supabase-js')
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { error: deleteUserError } = await adminSupabase.auth.admin.deleteUser(userId)
    
    if (deleteUserError) {
      console.error('사용자 삭제 오류:', deleteUserError)
      return NextResponse.json(
        { error: '사용자 삭제 중 오류가 발생했습니다: ' + deleteUserError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('사용자 삭제 처리 중 예외 발생:', error)
    return NextResponse.json(
      { error: '서버 오류: ' + error.message },
      { status: 500 }
    )
  }
}

// 모든 사용자 목록을 가져오는 API 엔드포인트
export async function GET() {
  try {
    // 서비스 역할 키를 사용하여 사용자 목록 가져오기
    const { createClient } = await import('@supabase/supabase-js')
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: users, error: usersError } = await adminSupabase.auth.admin.listUsers()
    
    if (usersError) {
      return NextResponse.json(
        { error: '사용자 목록 조회 중 오류가 발생했습니다: ' + usersError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ users: users.users })
  } catch (error: any) {
    console.error('사용자 목록 조회 중 예외 발생:', error)
    return NextResponse.json(
      { error: '서버 오류: ' + error.message },
      { status: 500 }
    )
  }
} 
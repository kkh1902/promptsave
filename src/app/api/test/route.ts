import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 설정 (환경 변수에서 키 가져오기)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opsegxznqckwpvhpotod.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 서비스 롤 키가 있는지 확인
if (!supabaseKey) {
  console.error('Supabase 키가 설정되지 않았습니다!')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

// 타입 정의
type UserInfo = {
  id: string;
  email: string | undefined;
}

type UserError = UserInfo & {
  error: string;
}

export async function POST() {
  try {
    // 추가할 사용자 ID
    const userId = '1ea6e9bf-82ca-40c9-a17c-017e43c6f2ad'
    
    // profiles 테이블에 사용자 정보 추가
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: userId,
          username: 'kkh1902',
          bio: '프롬프트 마스터',
          avatar_url: 'https://avatars.githubusercontent.com/u/12345678',
          website: 'https://promptsave.kkh1902.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          verified: true
        }
      ], 
      { onConflict: 'id' }) // ID가 충돌하면 업데이트
    
    if (error) {
      console.error('프로필 추가 오류:', error)
      return NextResponse.json({
        success: false,
        message: `프로필 추가 실패: ${error.message}`,
        error: error
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '프로필 정보가 성공적으로 추가되었습니다',
      data
    })
    
  } catch (error: any) {
    console.error('API 오류:', error)
    return NextResponse.json(
      {
        success: false,
        message: `API 오류: ${error.message || '알 수 없는 오류'}`,
        error: error
      },
      { status: 500 }
    )
  }
}

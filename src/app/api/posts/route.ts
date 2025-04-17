import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, category, tags, image_urls } = body
    
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용을 모두 입력해주세요.' },
        { status: 400 }
      )
    }
    
    // 서버 측에서 세션을 확인하여 인증 처리
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }
    
    // 데이터베이스에 포스트 저장
    const { data, error } = await supabase
      .from("posts")
      .insert({
        title,
        content,
        category,
        tags,
        image_urls,
        user_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "published",
        likes_count: 0,
        views_count: 0,
        comments_count: 0
      })
      .select()
      .single()
    
    if (error) {
      console.error("포스트 저장 중 오류:", error)
      return NextResponse.json(
        { error: '포스트 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("서버 오류:", error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 
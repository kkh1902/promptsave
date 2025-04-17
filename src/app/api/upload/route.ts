import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  try {
    // 세션 확인
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // 멀티파트 폼 데이터 처리
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: "파일이 없습니다." },
        { status: 400 }
      )
    }
    
    // 파일 확장자 가져오기
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`
    
    // Supabase Storage에 파일 업로드
    const { error: uploadError } = await supabase.storage
      .from('posts')
      .upload(filePath, file)
    
    if (uploadError) {
      console.error("파일 업로드 오류:", uploadError)
      return NextResponse.json(
        { error: "파일 업로드에 실패했습니다." },
        { status: 500 }
      )
    }
    
    // 파일 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from('posts')
      .getPublicUrl(filePath)
    
    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("파일 업로드 중 오류:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 
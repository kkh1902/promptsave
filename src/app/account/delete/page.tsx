'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Trash, ArrowLeft } from "lucide-react"
import { Navigation } from "@/components/navigation/navigation"
import { Footer } from "@/components/footer/footer"

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AccountDelete() {
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  
  const router = useRouter()
  
  // 로그인한 사용자 정보 불러오기
  useEffect(() => {
    async function loadUserData() {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        setError('접근할 수 없습니다. 로그인이 필요합니다.')
        return
      }
      
      setUserData(user)
    }
    
    loadUserData()
  }, [])
  
  // 사용자 계정 및 관련 데이터 삭제
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (confirmText !== '회원탈퇴확인') {
      setError('확인 텍스트가 일치하지 않습니다.')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      if (!userData) {
        throw new Error('사용자 정보를 찾을 수 없습니다.')
      }
      
      // 1. 사용자 재인증
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password
      })
      
      if (signInError) {
        throw new Error('비밀번호가 올바르지 않습니다.')
      }
      
      // 2. 관련 데이터 삭제 - 직접 Supabase 쿼리 사용
      
      // 2-1. 프로필 데이터 삭제
      const { error: profileDeleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userData.id)
      
      if (profileDeleteError) {
        console.error('프로필 삭제 오류:', profileDeleteError)
      }
      
      // 2-2. 팔로우 관계 데이터 삭제
      const { error: followsDeleteError } = await supabase
        .from('follows')
        .delete()
        .or(`follower_id.eq.${userData.id},following_id.eq.${userData.id}`)
      
      if (followsDeleteError) {
        console.error('팔로우 데이터 삭제 오류:', followsDeleteError)
      }
      
      // 2-3. 사용자 생성 콘텐츠 삭제
      const tables = ['posts', 'images', 'videos', 'ai_models', 'comments'];
      for (const table of tables) {
        try {
          const { error: tableDeleteError } = await supabase
            .from(table)
            .delete()
            .eq('user_id', userData.id);
            
          if (tableDeleteError) {
            console.error(`${table} 삭제 오류:`, tableDeleteError);
          }
        } catch (err) {
          console.error(`${table} 테이블 삭제 중 오류:`, err);
        }
      }
      
      // 3. 서버 API를 통해 사용자 계정 삭제 요청
      const response = await fetch('/api/auth/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData.id }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '계정 삭제 중 오류가 발생했습니다.');
      }
      
      // 4. 로그아웃 및 성공 메시지 표시
      await supabase.auth.signOut();
      setSuccess(true);
      
      // 5초 후 홈으로 리다이렉트
      setTimeout(() => {
        router.push('/');
      }, 5000);
      
    } catch (err: any) {
      setError(err.message || '계정 삭제 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="flex min-h-screen bg-background flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-green-600">회원탈퇴 완료</CardTitle>
              <CardDescription>
                회원 탈퇴가 성공적으로 처리되었습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                서비스를 이용해 주셔서 감사합니다. 5초 후 홈 페이지로 이동합니다...
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                홈으로 이동
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-background flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-2">
              <Trash className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-600">회원 탈퇴</CardTitle>
            </div>
            <CardDescription>
              회원 탈퇴를 진행하면 모든 데이터가 영구적으로 제거되며 이 작업은 되돌릴 수 없습니다.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleDeleteAccount}>
            <CardContent className="space-y-4 pt-5">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 확인</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="현재 비밀번호 입력"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm">
                  회원 탈퇴 확인을 위해 <span className="font-bold">회원탈퇴확인</span>을 정확히 입력하세요.
                </Label>
                <Input
                  id="confirm"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="회원탈퇴확인"
                  required
                />
              </div>
              
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-200">
                <p className="font-semibold">경고! 다음 데이터가 영구적으로 삭제됩니다:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>계정 정보 및 로그인 데이터</li>
                  <li>프로필 정보</li>
                  <li>팔로우/팔로워 관계</li>
                  <li>작성한 모든 게시물, 이미지, 비디오, AI 모델</li>
                  <li>댓글 및 기타 활동</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col gap-3">
              <Button 
                type="submit" 
                variant="destructive" 
                className="w-full" 
                disabled={loading || confirmText !== '회원탈퇴확인'}
              >
                {loading ? '처리 중...' : '회원 탈퇴 진행'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/profile')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                취소하고 프로필로 돌아가기
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
} 
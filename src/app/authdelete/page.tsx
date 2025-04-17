"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation/navigation"
import { Footer } from "@/components/footer/footer"
import { Trash, AlertTriangle, ArrowLeft, ShieldAlert, UserX } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteAccount } from "@/lib/auth"

export default function AuthDeletePage() {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)
  const [adminKey, setAdminKey] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [activeTab, setActiveTab] = useState("current")
  const [users, setUsers] = useState<any[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  
  // Supabase 클라이언트 초기화
  useEffect(() => {
    const initializeSupabase = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        
        if (!supabaseUrl || !supabaseAnonKey) {
          setError('Supabase 환경 변수가 설정되지 않았습니다.')
          return
        }
        
        const client = createClient(supabaseUrl, supabaseAnonKey)
        setSupabase(client)
      } catch (err) {
        console.error('Supabase 초기화 오류:', err)
        setError('인증 서비스 초기화에 실패했습니다.')
      }
    }
    
    initializeSupabase()
  }, [])
  
  // 현재 사용자 정보 가져오기
  const fetchCurrentUser = async () => {
    if (!supabase) return null
    
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    } catch (err) {
      console.error('현재 사용자 정보 가져오기 오류:', err)
      return null
    }
  }
  
  // 모든 사용자 정보 가져오기 (관리자 키 필요)
  const fetchAllUsers = async () => {
    if (!supabase || !adminKey) {
      setError('관리자 키가 필요합니다.')
      return
    }
    
    try {
      setIsLoadingUsers(true)
      setError(null)
      
      // 관리자 키로 새 클라이언트 생성
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const adminClient = createClient(supabaseUrl, adminKey)
      
      // 모든 사용자 가져오기
      const { data, error } = await adminClient.auth.admin.listUsers()
      
      if (error) throw error
      
      setUsers(data.users || [])
    } catch (err: any) {
      setError('사용자 목록 가져오기 실패: ' + (err.message || '알 수 없는 오류'))
      setUsers([])
    } finally {
      setIsLoadingUsers(false)
    }
  }
  
  // 현재 사용자 인증 정보 삭제 처리
  const handleDeleteCurrentUser = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      
      const result = await deleteAccount();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setSuccess(true);
      
      // 3초 후 홈으로 리다이렉트
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: any) {
      setError(err.message || '계정 삭제 중 오류가 발생했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }
  
  // 모든 사용자 인증 정보 삭제
  const handleDeleteAllUsers = async () => {
    if (!supabase || !adminKey) {
      setError('관리자 키가 필요합니다.')
      return
    }
    
    if (confirmText !== '모든사용자삭제확인') {
      setError('확인 문구가 올바르지 않습니다.')
      return
    }
    
    try {
      setIsDeleting(true)
      setError(null)
      
      // 관리자 키로 새 클라이언트 생성
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const adminClient = createClient(supabaseUrl, adminKey)
      
      // 현재 로그인된 사용자 확인
      const currentUser = await fetchCurrentUser()
      
      // 모든 사용자 가져오기
      const { data, error } = await adminClient.auth.admin.listUsers()
      
      if (error) throw error
      
      // 모든 사용자 삭제 (현재 사용자 제외)
      const users = data.users || []
      const results = []
      
      for (const user of users) {
        try {
          // 현재 로그인된 사용자는 나중에 처리
          if (currentUser && user.id === currentUser.id) continue
          
          const { error } = await adminClient.auth.admin.deleteUser(user.id)
          results.push({ id: user.id, success: !error, error: error?.message })
          
          if (error) console.error(`사용자 삭제 실패 (${user.id}):`, error)
        } catch (err) {
          console.error(`사용자 삭제 오류 (${user.id}):`, err)
          results.push({ id: user.id, success: false, error: String(err) })
        }
      }
      
      // 현재 사용자 삭제 (마지막에 처리)
      if (currentUser) {
        try {
          const { error } = await adminClient.auth.admin.deleteUser(currentUser.id)
          
          if (!error) {
            // 로그아웃
            await supabase.auth.signOut()
          }
        } catch (err) {
          console.error('현재 사용자 삭제 오류:', err)
        }
      }
      
      setSuccess(true)
      console.log('삭제 결과:', results)
      
      // 3초 후 홈으로 리다이렉트
      setTimeout(() => {
        router.push('/')
      }, 3000)
      
    } catch (err: any) {
      setError(err.message || '사용자 삭제 중 오류가 발생했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash className="h-5 w-5" />
              인증 정보 삭제
            </CardTitle>
            <CardDescription>
              Supabase의 auth.user 정보를 삭제합니다. 이 작업은 취소할 수 없습니다.
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">현재 사용자만</TabsTrigger>
              <TabsTrigger value="all">모든 사용자</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-4 mt-4">
              <CardContent className="space-y-4 p-0">
                {error && activeTab === "current" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>오류</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && activeTab === "current" ? (
                  <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <AlertTitle>삭제 완료</AlertTitle>
                    <AlertDescription>
                      인증 정보가 성공적으로 삭제되었습니다. 잠시 후 홈 페이지로 이동합니다.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-200">
                    <p className="font-semibold">경고: 다음 작업이 수행됩니다</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>현재 사용자 계정 인증 정보 영구 삭제</li>
                      <li>로그인 세션 종료</li>
                      <li>재로그인 시 계정 재생성 필요</li>
                    </ul>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between p-0">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isDeleting || success}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로 가기
                </Button>
                
                {!success && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteCurrentUser}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '처리 중...' : '현재 사용자 인증 정보 삭제'}
                  </Button>
                )}
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4 mt-4">
              <CardContent className="space-y-4 p-0">
                {error && activeTab === "all" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>오류</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && activeTab === "all" ? (
                  <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <AlertTitle>삭제 완료</AlertTitle>
                    <AlertDescription>
                      모든 사용자의 인증 정보가 성공적으로 삭제되었습니다. 잠시 후 홈 페이지로 이동합니다.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="h-5 w-5" />
                        <p className="font-bold">주의: 위험한 작업</p>
                      </div>
                      <p className="mb-2">이 작업은 Supabase의 <strong>모든 사용자 인증 정보</strong>를 영구적으로 삭제합니다.</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>모든 사용자의 계정 인증 정보가 삭제됩니다</li>
                        <li>이 작업은 되돌릴 수 없습니다</li>
                        <li>모든 로그인 세션이 종료됩니다</li>
                        <li>서비스 관리자도 다시 가입해야 합니다</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-key">Supabase 서비스 롤 키 (관리자 권한)</Label>
                        <Input
                          id="admin-key"
                          type="password"
                          placeholder="서비스 롤 키를 입력하세요"
                          value={adminKey}
                          onChange={(e) => setAdminKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Supabase 프로젝트 설정 &gt; API &gt; 서비스 롤 키에서 확인할 수 있습니다.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          onClick={fetchAllUsers}
                          disabled={!adminKey || isLoadingUsers}
                          className="w-full text-sm"
                        >
                          {isLoadingUsers ? '로드 중...' : '사용자 목록 가져오기'}
                        </Button>
                        
                        {users.length > 0 && (
                          <div className="rounded-md bg-muted p-3 text-sm">
                            <p className="font-medium mb-2">사용자 목록 ({users.length}명)</p>
                            <div className="max-h-32 overflow-y-auto space-y-1 text-xs">
                              {users.map(user => (
                                <div key={user.id} className="flex items-center justify-between">
                                  <span>{user.email || user.phone || user.id}</span>
                                  <UserX className="h-3 w-3 text-red-500" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-all-delete">
                          삭제를 확인하려면 <span className="font-bold">모든사용자삭제확인</span>을 입력하세요
                        </Label>
                        <Input
                          id="confirm-all-delete"
                          placeholder="모든사용자삭제확인"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between p-0">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isDeleting || success}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로 가기
                </Button>
                
                {!success && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAllUsers}
                    disabled={isDeleting || confirmText !== '모든사용자삭제확인' || !adminKey || users.length === 0}
                  >
                    {isDeleting ? '처리 중...' : '모든 사용자 인증 정보 삭제'}
                  </Button>
                )}
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
} 
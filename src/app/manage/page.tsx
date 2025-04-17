"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Navigation } from "@/components/navigation/navigation"
import { Footer } from "@/components/footer/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Trash, Search, UserCheck, Edit, AlertTriangle, Eye, FileText, Image as ImageIcon, Video, CheckCircle, XCircle, LucideIcon, RefreshCcw } from "lucide-react"

export default function ManagePage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("users")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: string} | null>(null)
  
  // 관리자 확인
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // 로그인 체크 대신 즉시 관리자 권한 부여
        setIsAdmin(true)
        setIsLoading(false)
        
        // 데이터 로드
        loadData()
      } catch (err) {
        console.error("데이터 로드 오류:", err)
        setIsLoading(false)
      }
    }
    
    checkAdmin()
  }, [])
  
  // 데이터 로드
  const loadData = async () => {
    setIsRefreshing(true)
    
    try {
      // 사용자 로드
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (usersError) throw usersError
      setUsers(usersData || [])
      
      // 게시물 로드
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*, users(*)')
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (postsError) throw postsError
      setPosts(postsData || [])
    } catch (err) {
      console.error("데이터 로드 오류:", err)
      toast.error("데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsRefreshing(false)
    }
  }
  
  // 검색 필터링
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // 사용자 삭제
  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(userId)
    
    try {
      // 1. 사용자 데이터 삭제
      const { error: usersDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
      
      if (usersDeleteError) throw usersDeleteError
      
      // 2. 관련 게시물 삭제
      const { error: postsDeleteError } = await supabase
        .from('posts')
        .delete()
        .eq('user_id', userId)
      
      if (postsDeleteError) console.error("게시물 삭제 오류:", postsDeleteError)
      
      // 3. Auth 사용자 삭제 (관리자 권한 필요)
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId)
      
      if (authDeleteError) console.error("Auth 사용자 삭제 오류:", authDeleteError)
      
      toast.success("사용자가 삭제되었습니다.")
      
      // 목록 갱신
      setUsers(users.filter(u => u.id !== userId))
    } catch (err) {
      console.error("사용자 삭제 오류:", err)
      toast.error("사용자 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsDeleting(null)
      setShowConfirmDialog(false)
    }
  }
  
  // 게시물 삭제
  const handleDeletePost = async (postId: string) => {
    setIsDeleting(postId)
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
      
      if (error) throw error
      
      toast.success("게시물이 삭제되었습니다.")
      
      // 목록 갱신
      setPosts(posts.filter(p => p.id !== postId))
    } catch (err) {
      console.error("게시물 삭제 오류:", err)
      toast.error("게시물 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsDeleting(null)
      setShowConfirmDialog(false)
    }
  }
  
  // 삭제 확인 다이얼로그 표시
  const confirmDelete = (id: string, type: string) => {
    setItemToDelete({ id, type })
    setShowConfirmDialog(true)
  }
  
  // 삭제 실행
  const executeDelete = () => {
    if (!itemToDelete) return
    
    if (itemToDelete.type === 'user') {
      handleDeleteUser(itemToDelete.id)
    } else if (itemToDelete.type === 'post') {
      handleDeletePost(itemToDelete.id)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </main>
        <Footer />
      </div>
    )
  }
  
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">접근 권한이 없습니다</h1>
            <p className="text-muted-foreground mb-4">관리자만 접근할 수 있는 페이지입니다.</p>
            <Button onClick={() => router.push('/')}>홈으로 돌아가기</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">관리자 페이지</h1>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              onClick={async () => {
                try {
                  const response = await fetch('/api/test', { method: 'POST' });
                  const data = await response.json();
                  toast.success(data.message || '테스트 완료');
                } catch (err) {
                  console.error('테스트 요청 오류:', err);
                  toast.error('테스트 요청 중 오류가 발생했습니다.');
                }
              }}
            >
              auth.User 삭제
            </Button>
            <Button 
              variant="outline" 
              onClick={loadData}
              disabled={isRefreshing}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="사용자 또는 게시물 검색..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">사용자 관리</TabsTrigger>
            <TabsTrigger value="posts">게시물 관리</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>사용자 목록 ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  등록된 모든 사용자를 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>사용자명</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>가입일</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url || "/images/placeholder-avatar.jpg"} alt={user.username || "사용자"} />
                                <AvatarFallback>{user.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{user.username || "-"}</TableCell>
                            <TableCell>{user.email || "-"}</TableCell>
                            <TableCell>
                              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mr-2"
                                onClick={() => router.push(`/profile?id=${user.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                보기
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(user.id, 'user')}
                                disabled={isDeleting === user.id}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                삭제
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            검색 결과가 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="posts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>게시물 목록 ({filteredPosts.length})</CardTitle>
                <CardDescription>
                  등록된 모든 게시물을 관리합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead>작성자</TableHead>
                        <TableHead>작성일</TableHead>
                        <TableHead className="text-right">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>
                              <div className="bg-muted w-8 h-8 rounded-md flex items-center justify-center">
                                <FileText className="h-4 w-4" />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{post.title || "-"}</TableCell>
                            <TableCell>{post.users?.username || "-"}</TableCell>
                            <TableCell>
                              {post.created_at ? new Date(post.created_at).toLocaleDateString() : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mr-2"
                                onClick={() => router.push(`/post/${post.id}`)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                보기
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => confirmDelete(post.id, 'post')}
                                disabled={isDeleting === post.id}
                              >
                                <Trash className="h-4 w-4 mr-1" />
                                삭제
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            검색 결과가 없습니다.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      
      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              삭제 확인
            </DialogTitle>
            <DialogDescription>
              {itemToDelete?.type === 'user' 
                ? '이 사용자를 삭제하면 모든 게시물과 데이터도 함께 삭제됩니다.' 
                : '이 게시물을 정말 삭제하시겠습니까?'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-semibold text-destructive">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={!!isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={executeDelete}
              disabled={!!isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
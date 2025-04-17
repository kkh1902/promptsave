"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation/navigation"
import { CategoryNavigation } from "@/components/category/category-navigation"
import { toast } from "sonner"
import { registerUser } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.")
      setIsLoading(false)
      return
    }

    try {
      const result = await registerUser({
        email,
        password,
        username: username || email.split('@')[0],
        redirectTo: `${window.location.origin}/auth/callback`
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (result.user) {
        setIsEmailSent(true);
        toast.success(result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <CategoryNavigation />
        
        <main className="flex-1 flex items-start justify-center pt-40">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                이메일 확인
              </h1>
              <p className="text-sm text-muted-foreground">
                {email}로 확인 이메일을 발송했습니다.
                <br />
                이메일을 확인하여 가입을 완료해주세요.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                이메일을 받지 못하셨나요?
                <Button
                  variant="link"
                  className="ml-2"
                  onClick={() => setIsEmailSent(false)}
                >
                  다시 시도하기
                </Button>
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <CategoryNavigation />
      
      <main className="flex-1 flex items-start justify-center pt-40">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              계정 만들기
            </h1>
            <p className="text-sm text-muted-foreground">
              이메일로 새 계정을 만드세요
            </p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">사용자 이름</Label>
                  <Input
                    id="username"
                    placeholder="username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    입력하지 않으면 이메일에서 자동 생성됩니다
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  회원가입
                </Button>
              </div>
            </form>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              로그인
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
} 
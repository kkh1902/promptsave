"use client" // Next.js 클라이언트 컴포넌트 선언

// 필요한 리액트 훅과 타입 임포트
import { createContext, useContext, useEffect, useState } from "react"
import { AuthState, User } from "./types" // 인증 상태와 사용자 타입 정의
import { useRouter } from "next/navigation" // 페이지 이동을 위한 라우터
import { createClient } from '@supabase/supabase-js' // Supabase 클라이언트 라이브러리

// Supabase 클라이언트 초기화 - 환경 변수에서 URL과 익명 키 사용
// 여기서 auth 옵션이 설정되지 않아 AuthSessionMissingError가 발생할 수 있음
// 문제 해결을 위해 persistSession, storage 등의 옵션을 명시적으로 설정해야 함
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 인증 컨텍스트 타입 정의 - AuthState를 확장하고 인증 관련 함수 포함
interface AuthContextType extends AuthState {
  isAuthenticated: boolean; // 인증 상태 플래그
  login: (email: string, password: string) => Promise<void> // 로그인 함수
  logout: () => Promise<void> // 로그아웃 함수
  refreshToken: () => Promise<void> // 토큰 갱신 함수
}

// 인증 컨텍스트 생성 - 초기값은 undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 인증 상태 제공자 컴포넌트 - 애플리케이션에 인증 상태 제공
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 인증 상태 관리를 위한 상태 변수
  const [state, setState] = useState<AuthState>({
    user: null, // 로그인한 사용자 정보 (null이면 비로그인)
    isAuthenticated: false, // 인증 여부
    isLoading: true, // 초기 로딩 상태
  })
  const router = useRouter() // 라우팅을 위한 Next.js 라우터

  // 컴포넌트 마운트 시 인증 상태 초기화 및 이벤트 리스너 설정
  useEffect(() => {
    // 초기 인증 상태 확인 함수
    const initAuth = async () => {
      try {
        // Supabase에서 현재 세션 정보 가져오기
        // 이 부분에서 AuthSessionMissingError가 발생할 수 있음
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error // 에러 발생 시 catch 블록으로 이동
        
        if (session) {
          // 세션이 있으면 인증된 상태로 설정
          setState({
            user: session.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          // 세션이 없으면 비인증 상태로 설정
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } catch (error) {
        // 오류 발생 시 로그 출력 및 비인증 상태로 설정
        console.error('Auth error:', error)
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }

    // 초기 인증 상태 확인 실행
    initAuth()

    // Supabase 인증 상태 변경 이벤트 구독
    // 로그인/로그아웃 시 자동으로 상태 업데이트
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // 로그인 시 인증 상태 업데이트
        setState({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
        })
      } else if (event === 'SIGNED_OUT') {
        // 로그아웃 시 비인증 상태로 업데이트
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    })

    // 컴포넌트 언마운트 시 이벤트 구독 해제 (메모리 누수 방지)
    return () => {
      subscription.unsubscribe()
    }
  }, []) // 빈 배열은 컴포넌트 마운트 시 한 번만 실행됨을 의미

  // 로그인 함수 - 이메일/비밀번호로 로그인 처리
  const login = async (email: string, password: string) => {
    try {
      // Supabase 비밀번호 로그인 API 호출
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error // 에러 발생 시 상위로 전파

      // 로그인 성공 시 홈페이지로 이동
      router.push("/")
    } catch (error) {
      // 에러를 상위 컴포넌트로 전파
      throw error
    }
  }

  // 로그아웃 함수 - 인증 세션 종료
  const logout = async () => {
    try {
      // Supabase 로그아웃 API 호출
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // 로그아웃 성공 시 로그인 페이지로 이동
      router.push("/login")
    } catch (error) {
      // 로그아웃 실패 시 오류 로깅
      console.error("Logout error:", error)
    }
  }

  // 토큰 갱신 함수 - 액세스 토큰 만료 시 사용
  const refreshToken = async () => {
    try {
      // Supabase 세션 갱신 API 호출
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      
      // 세션 갱신 성공 시 인증 상태 업데이트
      if (session) {
        setState({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
        })
      }
    } catch (error) {
      // 토큰 갱신 실패 시 로그아웃 처리
      logout()
    }
  }

  // 인증 컨텍스트 제공자 반환 - 자식 컴포넌트에 인증 상태와 함수 제공
  return (
    <AuthContext.Provider value={{ ...state, isAuthenticated: state.isAuthenticated, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

// 인증 컨텍스트를 사용하기 위한 커스텀 훅
// 컴포넌트에서 인증 상태와 함수를 쉽게 접근할 수 있게 함
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // AuthProvider 외부에서 사용 시 에러 발생
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
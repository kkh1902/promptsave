export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    [key: string]: any;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
} 
-- 기존 테이블이 있으면 삭제
DROP TABLE IF EXISTS profiles;

-- profiles 테이블 생성
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 보안 정책 설정
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 프로필 읽기 정책: 모든 사용자가 읽을 수 있음
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  USING (true);

-- 프로필 수정 정책: 자신의 프로필만 수정 가능
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 프로필 삽입 정책: 자신의 프로필만 생성 가능
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 트리거 생성: 사용자 생성 시 자동으로 프로필 생성
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_user(); 
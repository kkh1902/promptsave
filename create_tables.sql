-- 포스트 테이블 (기존 테이블)
-- 이미 존재하는 경우 아래 스크립트는 생략 가능
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

-- 개발 관련 포스트 테이블
CREATE TABLE IF NOT EXISTS development_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  github_url TEXT,
  tech_stack TEXT[]
);

-- 이미지 테이블
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  prompt TEXT,
  negative_prompt TEXT,
  model TEXT,
  seed BIGINT,
  cfg_scale FLOAT,
  steps INTEGER
);

-- 비디오 테이블
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  duration INTEGER,
  prompt TEXT,
  model TEXT
);

-- 모델 테이블
CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  download_url TEXT,
  model_type TEXT,
  base_model TEXT,
  version TEXT,
  license TEXT
);

-- 각 테이블에 대한 RLS 정책 추가
ALTER TABLE development_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- 조회 정책 (모든 사용자)
CREATE POLICY "공개 데이터 조회" ON development_posts FOR SELECT USING (status = 'published');
CREATE POLICY "공개 이미지 조회" ON images FOR SELECT USING (status = 'published');
CREATE POLICY "공개 비디오 조회" ON videos FOR SELECT USING (status = 'published');
CREATE POLICY "공개 모델 조회" ON models FOR SELECT USING (status = 'published');

-- 삽입/수정 정책 (인증된 사용자)
CREATE POLICY "인증된 사용자 데이터 삽입" ON development_posts 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "인증된 사용자 이미지 삽입" ON images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "인증된 사용자 비디오 삽입" ON videos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "인증된 사용자 모델 삽입" ON models
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 소유자만 수정/삭제 가능
CREATE POLICY "소유자 데이터 수정" ON development_posts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "소유자 이미지 수정" ON images
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "소유자 비디오 수정" ON videos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "소유자 모델 수정" ON models
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "소유자 데이터 삭제" ON development_posts
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "소유자 이미지 삭제" ON images
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "소유자 비디오 삭제" ON videos
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "소유자 모델 삭제" ON models
  FOR DELETE USING (auth.uid() = user_id); 
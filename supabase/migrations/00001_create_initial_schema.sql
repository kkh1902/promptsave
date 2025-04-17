-- 초기 데이터베이스 스키마 정의
-- 실행 순서에 맞게 DROP -> CREATE 순서로 작성

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 기존 테이블 드롭 (이미 존재하는 경우)
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS ai_models CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
DROP TABLE IF EXISTS development_posts CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS shop_items CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS drafts CASCADE;

-- 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  biography TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_admin BOOLEAN DEFAULT FALSE,
  social_links JSONB DEFAULT '{}'::JSONB,
  preferences JSONB DEFAULT '{}'::JSONB
);

-- 이미지 테이블
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  image_urls TEXT[] DEFAULT '{}'::TEXT[],
  tools TEXT[] DEFAULT '{}'::TEXT[],
  resources TEXT[] DEFAULT '{}'::TEXT[],
  tags TEXT[] DEFAULT '{}'::TEXT[],
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  prompt TEXT,
  negative_prompt TEXT,
  guidance_scale NUMERIC DEFAULT 7.5,
  steps INTEGER DEFAULT 30,
  seed BIGINT,
  sampler TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- 게시물 테이블
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}'::TEXT[],
  category TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- AI 모델 테이블
CREATE TABLE ai_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  version TEXT,
  description TEXT,
  model_type TEXT NOT NULL,
  cover_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}'::TEXT[],
  download_url TEXT,
  size_mb NUMERIC,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- 비디오 테이블
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- 개발 게시물 테이블
CREATE TABLE development_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}'::TEXT[],
  category TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  github_url TEXT,
  live_demo_url TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- 챌린지 테이블
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  rules TEXT,
  prizes TEXT,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  participants_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- 상점 아이템 테이블
CREATE TABLE shop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  cover_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}'::TEXT[],
  item_type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- 댓글 테이블
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_deleted BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  CONSTRAINT content_type_check CHECK (
    content_type IN ('post', 'image', 'video', 'ai_model', 'development_post', 'challenge', 'shop_item')
  )
);

-- 좋아요 테이블
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT content_type_check CHECK (
    content_type IN ('post', 'image', 'video', 'ai_model', 'development_post', 'challenge', 'shop_item', 'comment')
  ),
  UNIQUE(user_id, content_id, content_type)
);

-- 임시 저장 테이블 (초안)
CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  content TEXT,
  content_type TEXT NOT NULL,
  data JSONB DEFAULT '{}'::JSONB,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT content_type_check CHECK (
    content_type IN ('post', 'image', 'video', 'ai_model', 'development_post')
  )
);

-- 인덱스 생성
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_images_user_id ON images(user_id);
CREATE INDEX idx_images_created_at ON images(created_at);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_ai_models_user_id ON ai_models(user_id);
CREATE INDEX idx_ai_models_model_type ON ai_models(model_type);
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_development_posts_user_id ON development_posts(user_id);
CREATE INDEX idx_challenges_created_by ON challenges(created_by);
CREATE INDEX idx_shop_items_seller_id ON shop_items(seller_id);
CREATE INDEX idx_shop_items_item_type ON shop_items(item_type);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_content_id_type ON comments(content_id, content_type);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_content_id_type ON likes(content_id, content_type);
CREATE INDEX idx_drafts_user_id ON drafts(user_id);
CREATE INDEX idx_drafts_content_type ON drafts(content_type);

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

-- 관리자 역할 함수 생성
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 프로필 RLS 정책
CREATE POLICY "사용자는 자신의 프로필을 볼 수 있음" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "사용자는 자신의 프로필을 수정할 수 있음" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "프로필은 공개적으로 볼 수 있음" ON profiles
  FOR SELECT USING (true);

-- 이미지 RLS 정책
CREATE POLICY "이미지는 공개적으로 볼 수 있음" ON images
  FOR SELECT USING (is_public = true AND is_deleted = false);
CREATE POLICY "사용자는 자신의 이미지를 볼 수 있음" ON images
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 이미지를 수정할 수 있음" ON images
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 이미지를 삽입할 수 있음" ON images
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 이미지를 삭제할 수 있음" ON images
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 이미지를 볼 수 있음" ON images
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 이미지를 수정할 수 있음" ON images
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 이미지를 삭제할 수 있음" ON images
  FOR DELETE USING (is_admin());

-- 게시물 RLS 정책
CREATE POLICY "게시물은 공개적으로 볼 수 있음" ON posts
  FOR SELECT USING (is_public = true AND is_deleted = false);
CREATE POLICY "사용자는 자신의 게시물을 볼 수 있음" ON posts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 게시물을 수정할 수 있음" ON posts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 게시물을 삽입할 수 있음" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 게시물을 삭제할 수 있음" ON posts
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 게시물을 볼 수 있음" ON posts
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 게시물을 수정할 수 있음" ON posts
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 게시물을 삭제할 수 있음" ON posts
  FOR DELETE USING (is_admin());

-- AI 모델 RLS 정책
CREATE POLICY "AI 모델은 공개적으로 볼 수 있음" ON ai_models
  FOR SELECT USING (is_public = true AND is_deleted = false);
CREATE POLICY "사용자는 자신의 AI 모델을 볼 수 있음" ON ai_models
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 AI 모델을 수정할 수 있음" ON ai_models
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 AI 모델을 삽입할 수 있음" ON ai_models
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 AI 모델을 삭제할 수 있음" ON ai_models
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 AI 모델을 볼 수 있음" ON ai_models
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 AI 모델을 수정할 수 있음" ON ai_models
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 AI 모델을 삭제할 수 있음" ON ai_models
  FOR DELETE USING (is_admin());

-- 비디오 RLS 정책
CREATE POLICY "비디오는 공개적으로 볼 수 있음" ON videos
  FOR SELECT USING (is_public = true AND is_deleted = false);
CREATE POLICY "사용자는 자신의 비디오를 볼 수 있음" ON videos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 비디오를 수정할 수 있음" ON videos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 비디오를 삽입할 수 있음" ON videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 비디오를 삭제할 수 있음" ON videos
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 비디오를 볼 수 있음" ON videos
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 비디오를 수정할 수 있음" ON videos
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 비디오를 삭제할 수 있음" ON videos
  FOR DELETE USING (is_admin());

-- 개발 게시물 RLS 정책
CREATE POLICY "개발 게시물은 공개적으로 볼 수 있음" ON development_posts
  FOR SELECT USING (is_public = true AND is_deleted = false);
CREATE POLICY "사용자는 자신의 개발 게시물을 볼 수 있음" ON development_posts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 개발 게시물을 수정할 수 있음" ON development_posts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 개발 게시물을 삽입할 수 있음" ON development_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 개발 게시물을 삭제할 수 있음" ON development_posts
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 개발 게시물을 볼 수 있음" ON development_posts
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 개발 게시물을 수정할 수 있음" ON development_posts
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 개발 게시물을 삭제할 수 있음" ON development_posts
  FOR DELETE USING (is_admin());

-- 챌린지 RLS 정책
CREATE POLICY "챌린지는 공개적으로 볼 수 있음" ON challenges
  FOR SELECT USING (is_public = true AND is_deleted = false);
CREATE POLICY "사용자는 자신의 챌린지를 볼 수 있음" ON challenges
  FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "사용자는 자신의 챌린지를 수정할 수 있음" ON challenges
  FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "사용자는 자신의 챌린지를 삽입할 수 있음" ON challenges
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "사용자는 자신의 챌린지를 삭제할 수 있음" ON challenges
  FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "관리자는 모든 챌린지를 볼 수 있음" ON challenges
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 챌린지를 수정할 수 있음" ON challenges
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 챌린지를 삭제할 수 있음" ON challenges
  FOR DELETE USING (is_admin());

-- 상점 아이템 RLS 정책
CREATE POLICY "상점 아이템은 공개적으로 볼 수 있음" ON shop_items
  FOR SELECT USING (is_public = true AND is_deleted = false);
CREATE POLICY "사용자는 자신의 상점 아이템을 볼 수 있음" ON shop_items
  FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "사용자는 자신의 상점 아이템을 수정할 수 있음" ON shop_items
  FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "사용자는 자신의 상점 아이템을 삽입할 수 있음" ON shop_items
  FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "사용자는 자신의 상점 아이템을 삭제할 수 있음" ON shop_items
  FOR DELETE USING (auth.uid() = seller_id);
CREATE POLICY "관리자는 모든 상점 아이템을 볼 수 있음" ON shop_items
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 상점 아이템을 수정할 수 있음" ON shop_items
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 상점 아이템을 삭제할 수 있음" ON shop_items
  FOR DELETE USING (is_admin());

-- 댓글 RLS 정책
CREATE POLICY "댓글은 공개적으로 볼 수 있음" ON comments
  FOR SELECT USING (is_deleted = false);
CREATE POLICY "사용자는 자신의 댓글을 볼 수 있음" ON comments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 댓글을 수정할 수 있음" ON comments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 댓글을 삽입할 수 있음" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 댓글을 삭제할 수 있음" ON comments
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 댓글을 볼 수 있음" ON comments
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 댓글을 수정할 수 있음" ON comments
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 댓글을 삭제할 수 있음" ON comments
  FOR DELETE USING (is_admin());

-- 좋아요 RLS 정책
CREATE POLICY "좋아요는 공개적으로 볼 수 있음" ON likes
  FOR SELECT USING (true);
CREATE POLICY "사용자는 자신의 좋아요를 볼 수 있음" ON likes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 좋아요를 삽입할 수 있음" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 좋아요를 삭제할 수 있음" ON likes
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 좋아요를 볼 수 있음" ON likes
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 좋아요를 삭제할 수 있음" ON likes
  FOR DELETE USING (is_admin());

-- 임시 저장 RLS 정책
CREATE POLICY "사용자는 자신의 임시 저장을 볼 수 있음" ON drafts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 임시 저장을 수정할 수 있음" ON drafts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "사용자는 임시 저장을 삽입할 수 있음" ON drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "사용자는 자신의 임시 저장을 삭제할 수 있음" ON drafts
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "관리자는 모든 임시 저장을 볼 수 있음" ON drafts
  FOR SELECT USING (is_admin());
CREATE POLICY "관리자는 모든 임시 저장을 수정할 수 있음" ON drafts
  FOR UPDATE USING (is_admin());
CREATE POLICY "관리자는 모든 임시 저장을 삭제할 수 있음" ON drafts
  FOR DELETE USING (is_admin());

-- 좋아요 추가/삭제에 따른 좋아요 수 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
DECLARE
  target_table TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    target_table := NEW.content_type;
    
    CASE target_table
      WHEN 'post' THEN
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
      WHEN 'image' THEN
        UPDATE images SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
      WHEN 'video' THEN
        UPDATE videos SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
      WHEN 'ai_model' THEN
        UPDATE ai_models SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
      WHEN 'development_post' THEN
        UPDATE development_posts SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
      WHEN 'challenge' THEN
        UPDATE challenges SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
      WHEN 'shop_item' THEN
        UPDATE shop_items SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
      WHEN 'comment' THEN
        UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
      ELSE
        NULL;
    END CASE;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    target_table := OLD.content_type;
    
    CASE target_table
      WHEN 'post' THEN
        UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
      WHEN 'image' THEN
        UPDATE images SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
      WHEN 'video' THEN
        UPDATE videos SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
      WHEN 'ai_model' THEN
        UPDATE ai_models SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
      WHEN 'development_post' THEN
        UPDATE development_posts SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
      WHEN 'challenge' THEN
        UPDATE challenges SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
      WHEN 'shop_item' THEN
        UPDATE shop_items SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
      WHEN 'comment' THEN
        UPDATE comments SET likes_count = likes_count - 1 WHERE id = OLD.content_id;
      ELSE
        NULL;
    END CASE;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 좋아요 트리거 생성
CREATE TRIGGER likes_trigger
AFTER INSERT OR DELETE ON likes
FOR EACH ROW
EXECUTE PROCEDURE update_likes_count();

-- 댓글 추가/삭제에 따른 댓글 수 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
DECLARE
  target_table TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- 삭제된 댓글이 아닌 경우에만 댓글 수 증가
    IF NEW.is_deleted = false THEN
      target_table := NEW.content_type;
      
      CASE target_table
        WHEN 'post' THEN
          UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'image' THEN
          UPDATE images SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'video' THEN
          UPDATE videos SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'ai_model' THEN
          UPDATE ai_models SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'development_post' THEN
          UPDATE development_posts SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'challenge' THEN
          UPDATE challenges SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'shop_item' THEN
          UPDATE shop_items SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        ELSE
          NULL;
      END CASE;
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- 댓글이 삭제 표시된 경우 댓글 수 감소
    IF OLD.is_deleted = false AND NEW.is_deleted = true THEN
      target_table := NEW.content_type;
      
      CASE target_table
        WHEN 'post' THEN
          UPDATE posts SET comments_count = comments_count - 1 WHERE id = NEW.content_id;
        WHEN 'image' THEN
          UPDATE images SET comments_count = comments_count - 1 WHERE id = NEW.content_id;
        WHEN 'video' THEN
          UPDATE videos SET comments_count = comments_count - 1 WHERE id = NEW.content_id;
        WHEN 'ai_model' THEN
          UPDATE ai_models SET comments_count = comments_count - 1 WHERE id = NEW.content_id;
        WHEN 'development_post' THEN
          UPDATE development_posts SET comments_count = comments_count - 1 WHERE id = NEW.content_id;
        WHEN 'challenge' THEN
          UPDATE challenges SET comments_count = comments_count - 1 WHERE id = NEW.content_id;
        WHEN 'shop_item' THEN
          UPDATE shop_items SET comments_count = comments_count - 1 WHERE id = NEW.content_id;
        ELSE
          NULL;
      END CASE;
    -- 댓글이 삭제 취소된 경우 댓글 수 증가
    ELSIF OLD.is_deleted = true AND NEW.is_deleted = false THEN
      target_table := NEW.content_type;
      
      CASE target_table
        WHEN 'post' THEN
          UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'image' THEN
          UPDATE images SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'video' THEN
          UPDATE videos SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'ai_model' THEN
          UPDATE ai_models SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'development_post' THEN
          UPDATE development_posts SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'challenge' THEN
          UPDATE challenges SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        WHEN 'shop_item' THEN
          UPDATE shop_items SET comments_count = comments_count + 1 WHERE id = NEW.content_id;
        ELSE
          NULL;
      END CASE;
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- 삭제된 댓글이 아닌 경우에만 댓글 수 감소
    IF OLD.is_deleted = false THEN
      target_table := OLD.content_type;
      
      CASE target_table
        WHEN 'post' THEN
          UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
        WHEN 'image' THEN
          UPDATE images SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
        WHEN 'video' THEN
          UPDATE videos SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
        WHEN 'ai_model' THEN
          UPDATE ai_models SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
        WHEN 'development_post' THEN
          UPDATE development_posts SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
        WHEN 'challenge' THEN
          UPDATE challenges SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
        WHEN 'shop_item' THEN
          UPDATE shop_items SET comments_count = comments_count - 1 WHERE id = OLD.content_id;
        ELSE
          NULL;
      END CASE;
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 댓글 트리거 생성
CREATE TRIGGER comments_trigger
AFTER INSERT OR UPDATE OR DELETE ON comments
FOR EACH ROW
EXECUTE PROCEDURE update_comments_count();

-- 첫 관리자 계정 생성을 위한 함수 (프로젝트 설정 시 한 번만 실행하면 됨)
CREATE OR REPLACE FUNCTION create_admin_user(admin_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET is_admin = TRUE
  WHERE id = admin_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
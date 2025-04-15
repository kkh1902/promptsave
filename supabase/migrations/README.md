# Supabase 마이그레이션

이 디렉토리는 Supabase 데이터베이스 스키마 마이그레이션 파일을 포함하고 있습니다. 마이그레이션 파일은 데이터베이스 스키마를 생성하고 업데이트하는 데 사용됩니다.

## 마이그레이션 파일

- `00001_create_initial_schema.sql`: 초기 데이터베이스 스키마 생성

## 마이그레이션 실행 방법

Supabase CLI를 사용하여 마이그레이션을 실행합니다.

### 1. Supabase CLI 설치

```bash
npm install -g supabase
```

### 2. 로컬 개발 환경 시작

```bash
supabase start
```

### 3. 마이그레이션 적용

```bash
supabase db reset
```

또는 새 마이그레이션만 적용하려면:

```bash
supabase db push
```

## 새 마이그레이션 생성 방법

```bash
supabase migration new <migration_name>
```

예시:

```bash
supabase migration new add_user_settings
```

이 명령어는 `<timestamp>_add_user_settings.sql` 파일을 생성합니다.

## 현재 스키마 구조

현재 스키마는 다음과 같은 테이블을 포함하고 있습니다:

- `profiles`: 사용자 프로필 정보 저장
- `images`: AI로 생성된 이미지 및 관련 메타데이터 저장
- `posts`: 블로그 포스트 및 게시물 저장
- `ai_models`: AI 모델 정보 저장
- `videos`: 비디오 콘텐츠 저장
- `development_posts`: 개발 관련 게시물 저장
- `challenges`: 커뮤니티 챌린지 정보 저장
- `shop_items`: 상점 아이템 정보 저장
- `comments`: 모든 콘텐츠 유형에 대한 댓글 저장
- `likes`: 좋아요 정보 저장
- `drafts`: 임시 저장된 콘텐츠 저장

각 테이블은 Row Level Security (RLS) 정책을 가지고 있어 사용자는 자신의 데이터만 수정할 수 있으며, 공개로 설정된 데이터만 다른 사용자에게 표시됩니다.

## 트리거 함수

### `update_likes_count()`

콘텐츠에 좋아요가 추가되거나 삭제될 때 해당 콘텐츠의 좋아요 수를 자동으로 업데이트합니다.

### `update_comments_count()`

콘텐츠에 댓글이 추가되거나 삭제될 때 해당 콘텐츠의 댓글 수를 자동으로 업데이트합니다. 
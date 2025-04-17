-- 인증된 사용자가 images 테이블에 삽입할 수 있도록 허용
CREATE POLICY "인증된 사용자는 images 삽입 가능" ON "public"."images"
FOR INSERT TO authenticated
WITH CHECK (true);

-- 인증된 사용자가 자신의 images 읽을 수 있도록 허용
CREATE POLICY "인증된 사용자는 자신의 images 읽기 가능" ON "public"."images"
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 모든 사용자가 images 읽을 수 있도록 허용 (공개 이미지)
CREATE POLICY "모든 사용자는 공개 images 읽기 가능" ON "public"."images"
FOR SELECT
USING (is_public = true);

-- RLS 활성화 (아직 활성화되지 않은 경우)
ALTER TABLE "public"."images" ENABLE ROW LEVEL SECURITY; 
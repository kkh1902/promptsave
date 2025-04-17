-- 이미지 삽입을 위한 함수 생성
CREATE OR REPLACE FUNCTION insert_image(
  p_title TEXT,
  p_content TEXT,
  p_user_id UUID,
  p_image_url TEXT
) RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- 이미지 테이블에 데이터 삽입
  INSERT INTO images (
    -- 여기에 실제 존재하는 필드 이름 사용
    title, 
    content,
    user_id,
    -- 이미지 URL을 위한 실제 필드 이름 (thumbnail, src, path 등이 될 수 있음)
    thumbnail,
    created_at
  ) VALUES (
    p_title,
    p_content,
    p_user_id,
    p_image_url,
    NOW()
  )
  RETURNING to_jsonb(images.*) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
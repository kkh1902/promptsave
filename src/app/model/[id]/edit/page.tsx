"use client";

import { useParams } from 'next/navigation';

export default function EditModelPage() {
  const params = useParams();
  const modelId = params.id;

  // TODO: modelId를 사용하여 기존 모델 데이터 로드
  // TODO: 수정 폼 구현

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">모델 수정</h1>
      <p>모델 ID: {modelId}</p>
      <p>여기에 모델 수정 폼이 들어갈 예정입니다.</p>
      {/* 수정 폼 컴포넌트 추가 */}
    </div>
  );
} 
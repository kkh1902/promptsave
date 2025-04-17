"use client";

import { useParams } from 'next/navigation';

export default function EditVideoPage() {
  const params = useParams();
  const videoId = params.id;

  // TODO: videoId를 사용하여 기존 비디오 데이터 로드
  // TODO: 수정 폼 구현

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">비디오 수정</h1>
      <p>비디오 ID: {videoId}</p>
      <p>여기에 비디오 수정 폼이 들어갈 예정입니다.</p>
      {/* 수정 폼 컴포넌트 추가 */}
    </div>
  );
} 
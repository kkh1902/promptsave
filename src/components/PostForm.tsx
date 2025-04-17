"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'

export function PostForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('폼 제출 시작')
    
    if (!isAuthenticated) {
      console.log('로그인되지 않음')
      setError('로그인이 필요합니다.')
      return
    }

    if (isSubmitting) {
      console.log('이미 제출 중')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      console.log('요청 준비 시작')
      const requestData = { title, content, category }
      console.log('요청 데이터:', requestData)
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('응답 받음:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('에러 응답:', error)
        throw new Error(error.message || '게시물 작성에 실패했습니다.')
      }

      const data = await response.json()
      console.log('게시물 작성 성공:', data)
      
      // 폼 초기화
      setTitle('')
      setContent('')
      setCategory('general')
      setError('')
    } catch (error) {
      console.error('에러 상세:', error)
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          제목
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          카테고리
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          disabled={isSubmitting}
        >
          <option value="general">일반</option>
          <option value="tech">기술</option>
          <option value="art">예술</option>
          <option value="science">과학</option>
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          rows={4}
          required
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        className={`rounded-md px-4 py-2 text-white ${
          isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? '게시 중...' : '게시하기'}
      </button>
    </form>
  )
} 
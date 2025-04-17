'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, Tag, DollarSign } from 'lucide-react'

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    positive_prompt: '',
    negative_prompt: '',
    model_name: '',
    category: '',
    image_url: '',
    is_paid: false,
    price: 0,
    tags: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from('prompts').insert([
        {
          ...formData,
          tags: formData.tags.split(',').map((tag) => tag.trim()),
        },
      ])

      if (error) throw error
      alert('프롬프트가 성공적으로 업로드되었습니다!')
      setFormData({
        title: '',
        description: '',
        positive_prompt: '',
        negative_prompt: '',
        model_name: '',
        category: '',
        image_url: '',
        is_paid: false,
        price: 0,
        tags: '',
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              프롬프트 업로드
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              새로운 AI 프롬프트를 공유하세요
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="positive_prompt"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Positive Prompt
              </label>
              <textarea
                id="positive_prompt"
                name="positive_prompt"
                value={formData.positive_prompt}
                onChange={handleChange}
                required
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
              />
            </div>

            <div>
              <label
                htmlFor="negative_prompt"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Negative Prompt
              </label>
              <textarea
                id="negative_prompt"
                name="negative_prompt"
                value={formData.negative_prompt}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="model_name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  모델
                </label>
                <select
                  id="model_name"
                  name="model_name"
                  value={formData.model_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">선택하세요</option>
                  <option value="Stable Diffusion">Stable Diffusion</option>
                  <option value="Midjourney">Midjourney</option>
                  <option value="DALL-E">DALL-E</option>
                  <option value="Karlo">Karlo</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  카테고리
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">선택하세요</option>
                  <option value="character">캐릭터</option>
                  <option value="landscape">풍경</option>
                  <option value="architecture">건축</option>
                  <option value="anime">애니메이션</option>
                  <option value="realistic">사실적</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                이미지 URL
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                  <ImageIcon className="h-5 w-5" />
                </span>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  required
                  className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                태그 (쉼표로 구분)
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                  <Tag className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_paid"
                name="is_paid"
                checked={formData.is_paid}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_paid"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                유료 프롬프트
              </label>
            </div>

            {formData.is_paid && (
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  가격 (원)
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                    <DollarSign className="h-5 w-5" />
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    업로드 중...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    업로드
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
} 
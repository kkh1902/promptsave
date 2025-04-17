'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Prompt } from '@/types/database'
import { motion } from 'framer-motion'
import { User, Upload, ShoppingCart, Settings } from 'lucide-react'
import PromptCard from '@/components/PromptCard'

export default function MyPage() {
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('로그인이 필요합니다')

        // 사용자가 업로드한 프롬프트 가져오기
        const { data: promptsData, error: promptsError } = await supabase
          .from('prompts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (promptsError) throw promptsError

        // 사용자의 구매 내역 가져오기
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .order('purchased_at', { ascending: false })

        if (purchasesError) throw purchasesError

        setUserPrompts(promptsData || [])
        setPurchases(purchasesData || [])
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 사이드바 */}
          <div className="w-full md:w-64">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      내 계정
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      설정 및 내역 관리
                    </p>
                  </div>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#uploads"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Upload className="w-5 h-5" />
                      내 업로드
                    </a>
                  </li>
                  <li>
                    <a
                      href="#purchases"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      구매 내역
                    </a>
                  </li>
                  <li>
                    <a
                      href="#settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Settings className="w-5 h-5" />
                      설정
                    </a>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            {/* 내 업로드 섹션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  내 업로드
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  내가 업로드한 프롬프트 목록입니다
                </p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden animate-pulse"
                      >
                        <div className="aspect-square bg-gray-200 dark:bg-gray-600" />
                        <div className="p-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userPrompts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPrompts.map((prompt, i) => (
                      <motion.div
                        key={prompt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <PromptCard prompt={prompt} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      아직 업로드한 프롬프트가 없습니다
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* 구매 내역 섹션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  구매 내역
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  내가 구매한 프롬프트 목록입니다
                </p>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : purchases.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            아이템
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            가격
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            구매일
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {purchases.map((purchase) => (
                          <tr key={purchase.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {purchase.prompt_title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {purchase.price}원
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {new Date(purchase.purchased_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      아직 구매한 프롬프트가 없습니다
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 
import Image from 'next/image'
import Link from 'next/link'
import { Prompt } from '@/types/database'

interface PromptCardProps {
  prompt: Prompt
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link href={`/prompt/${prompt.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        {/* 이미지 섹션 */}
        <div className="relative aspect-square w-full">
          <Image
            src={prompt.image_url}
            alt={prompt.title}
            fill
            className="object-cover"
          />
          {prompt.is_paid && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              {prompt.price}원
            </div>
          )}
        </div>

        {/* 정보 섹션 */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {prompt.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {prompt.model_name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-500">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {prompt.category}
            </span>
          </div>

          {/* 태그들 */}
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
} 
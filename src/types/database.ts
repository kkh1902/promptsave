export type Category = 'image' | 'video' | 'code' | 'marketing' | 'other'
export type ModelType = 'comfyui' | 'cursorai' | 'midjourney' | 'chatgpt' | 'other'
export type ItemType = 'prompt' | 'workflow'

export interface User {
  id: string
  email: string
  username: string
  created_at: string
}

export interface Prompt {
  id: string
  user_id: string
  title: string
  description: string
  positive_prompt: string
  negative_prompt?: string
  model_name: string
  category: Category
  type: ModelType
  tags: string[]
  image_url: string
  is_paid: boolean
  price: number
  created_at: string
}

export interface Workflow {
  id: string
  user_id: string
  prompt_id: string
  json_url: string
  preview_image_url: string
  is_paid: boolean
  price: number
  created_at: string
}

export interface Purchase {
  id: string
  buyer_id: string
  item_type: ItemType
  item_id: string
  price: number
  purchased_at: string
} 
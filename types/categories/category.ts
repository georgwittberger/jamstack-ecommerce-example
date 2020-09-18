import { NuxtContentResult } from '@/types/nuxt-content-result'

export type Category = {
  id: string
  name: string
  description: string
}

export type CategoryResult = Category & NuxtContentResult

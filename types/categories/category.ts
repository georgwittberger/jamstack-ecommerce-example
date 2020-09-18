import { NuxtContentResult } from '@/types/nuxt-content-result'

export type Category = {
  name: string
  description: string
}

export type CategoryResult = Category & NuxtContentResult

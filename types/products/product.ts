import { NuxtContentResult } from '@/types/nuxt-content-result'

export type Product = {
  id: string
  sku: string
  name: string
  description: string
  price: number
}

export type ProductResult = Product & NuxtContentResult

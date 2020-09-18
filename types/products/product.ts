import { NuxtContentResult } from '@/types/nuxt-content-result'

export type Product = {
  id: string
  sku: string
  name: string
  description: string
  price: number
  category: ProductCategory
}

export type ProductResult = Product & NuxtContentResult

type ProductCategory = { name: string; slug: string }

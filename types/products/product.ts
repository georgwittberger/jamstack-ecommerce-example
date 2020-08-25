import { NuxtContentResult } from '@/types/nuxt-content-result'

export interface ProductResult extends Product, NuxtContentResult {}

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
}

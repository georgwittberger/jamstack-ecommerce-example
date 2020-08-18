import { NuxtContentResult } from './nuxt-content-result'

export interface ProductResult extends Product, NuxtContentResult {}

interface Product {
  id: string
  name: string
  description: string
}

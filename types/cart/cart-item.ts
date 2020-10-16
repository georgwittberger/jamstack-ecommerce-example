import { ProductResult } from '@/types/products/product'

export type CartItem = {
  id: string
  product: ProductResult
  quantity: number
  unitPrice: number
  totalPrice: number
}

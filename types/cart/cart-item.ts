import { IContentDocument } from '@nuxt/content/types/content'
import { ProductDocument } from '@/types/products/product'

export type CartItem = {
  id: string
  product: ProductDocument & IContentDocument
  quantity: number
  unitPrice: number
  totalPrice: number
}

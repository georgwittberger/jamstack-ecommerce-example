import { IContentDocument } from '@nuxt/content/types/content'
import { ProductDocument } from '@/types/products/product'

export type ProductSortOption = {
  label: string
  field: string
  direction: 'asc' | 'desc'
}

export function sortProducts<
  T extends Partial<ProductDocument & IContentDocument>
>(products: T[], sortOption: ProductSortOption): T[] {
  return products.slice().sort((first, second) => {
    const firstValue = first[sortOption.field]
    const secondValue = second[sortOption.field]
    const directionModifier = sortOption.direction === 'desc' ? -1 : 1
    if (firstValue < secondValue) return directionModifier * -1
    if (firstValue > secondValue) return directionModifier * 1
    return 0
  })
}

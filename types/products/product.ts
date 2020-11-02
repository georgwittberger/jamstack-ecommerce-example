export type ProductDocument = {
  id: string
  sku: string
  name: string
  description: string
  price: number
  category: ProductCategory
}

type ProductCategory = { name: string; slug: string }

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import { getCategorySlug, otherCategory } from './categories'
import log from './logger'
import { executeSoqlQuery } from './salesforce-api'

const standardPriceBookName =
  process.env.SALESFORCE_PRICE_BOOK_NAME || 'Standard Price Book'

export async function updateProductsContent(
  accessToken: string
): Promise<Product[]> {
  log.info('Removing old product content files...')
  await deleteProductsContentFiles()
  log.info('Product content files removed.')

  log.info('Requesting new product content...')
  const productsSoqlQuery = `
    SELECT
      Id, Name, StockKeepingUnit, Description, jsec_ProductCategory__r.Name,
      (SELECT UnitPrice FROM PricebookEntries WHERE Pricebook2.Name = '${standardPriceBookName}')
    FROM Product2
    WHERE IsActive = true`
  const productsQueryResult = await executeSoqlQuery(
    productsSoqlQuery,
    accessToken
  )
  log.info('Product content received.')

  const products = createProductsContent(productsQueryResult)

  log.info('Writing new product content files...')
  const productsContentPath = createProductsContentPath()
  products.forEach((product) => {
    const productDirectoryPath = path.resolve(
      productsContentPath,
      product.category.slug
    )
    const productFilePath = path.resolve(
      productDirectoryPath,
      `${getProductSlug(product.name)}.json`
    )
    ensureDirectoryExists(productDirectoryPath)
    writeFileSync(productFilePath, JSON.stringify(product, null, 2), 'utf8')
    log.info('Written: %s', productFilePath)
  })

  log.info(
    'Product content files updated. Number of products: %d',
    products.length
  )
  return products
}

function deleteProductsContentFiles(): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    rimraf(path.resolve(getProductsContentPath(), '**/*.json'), (error) => {
      if (!error) resolve()
      else reject(error)
    })
  )
}

function createProductsContent(productsQueryResult: any): Product[] {
  if (!productsQueryResult?.records) return []
  const records: any[] = productsQueryResult.records
  return records.map(convertRecordToProduct)
}

function convertRecordToProduct(record: any): Product {
  const price: number = getFirstPricebookEntryUnitPrice(record) || 0
  const category: ProductCategory = getProductCategory(record)
  return {
    id: record.Id,
    sku: record.StockKeepingUnit,
    name: record.Name,
    description: record.Description,
    price,
    category,
  }
}

function getFirstPricebookEntryUnitPrice(record: any): number | undefined {
  return record.PricebookEntries?.records?.length
    ? record.PricebookEntries.records[0].UnitPrice
    : undefined
}

function getProductCategory(record: any): ProductCategory {
  return record.jsec_ProductCategory__r
    ? {
        name: record.jsec_ProductCategory__r.Name,
        slug: getCategorySlug(record.jsec_ProductCategory__r.Name),
      }
    : {
        name: otherCategory.name,
        slug: getCategorySlug(otherCategory.name),
      }
}

function createProductsContentPath(): string {
  const productsContentPath = getProductsContentPath()
  ensureDirectoryExists(productsContentPath)
  return productsContentPath
}

function ensureDirectoryExists(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }
}

export function getProductsContentPath(): string {
  return path.resolve(__dirname, '../content/products')
}

export function getProductSlug(productName: string): string {
  return productName.replace(/[^\w]|_/g, '-').toLowerCase()
}

export type Product = {
  id: string
  sku: string
  name: string
  description: string
  price: number
  category: ProductCategory
}

type ProductCategory = { name: string; slug: string }

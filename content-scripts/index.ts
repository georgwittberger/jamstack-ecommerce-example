import 'dotenv/config'
import * as path from 'path'
import { writeFileSync } from 'fs'
import rimraf from 'rimraf'
import { getAccessToken, executeSoqlQuery } from './salesforce-api'

const standardPriceBookName =
  process.env.SALESFORCE_PRICE_BOOK_NAME || 'Standard Price Book'

async function execute() {
  const accessToken = await getAccessToken()
  await updateProductsContent(accessToken)
}

execute()
  .then(() => {
    console.info('Content update successful')
  })
  .catch((error) => {
    console.error('Content update failed', error)
  })

async function updateProductsContent(accessToken: string) {
  const productsContentPath = path.resolve(__dirname, '../content/products')

  await new Promise<void>((resolve, reject) =>
    rimraf(path.resolve(productsContentPath, '*.json'), (error) => {
      if (!error) resolve()
      else reject(error)
    })
  )

  const productsSoqlQuery = `SELECT Id, Name, StockKeepingUnit, Description, (SELECT UnitPrice FROM PricebookEntries WHERE Pricebook2.Name = '${standardPriceBookName}') FROM Product2`
  const productsQueryResult = await executeSoqlQuery(
    productsSoqlQuery,
    accessToken
  )

  const products = createProductsContent(productsQueryResult)
  products.forEach((product) => {
    const productFilePath = path.resolve(
      productsContentPath,
      `${getProductSlug(product)}.json`
    )
    writeFileSync(productFilePath, JSON.stringify(product, null, 2), 'utf8')
    console.info(`Saved: ${productFilePath}`)
  })
}

function createProductsContent(productsQueryResult: any): Product[] {
  if (!productsQueryResult?.records) return []
  return productsQueryResult.records.map(
    (record: any) =>
      ({
        id: record.Id,
        sku: record.StockKeepingUnit,
        name: record.Name,
        description: record.Description,
        price: record.PricebookEntries?.records?.length
          ? record.PricebookEntries.records[0].UnitPrice
          : null,
      } as Product)
  )
}

function getProductSlug(product: Product): string {
  return product.name.replace(/[^\w]|_/g, '-').toLowerCase()
}

type Product = {
  id: string
  sku: string
  name: string
  description: string
  price: number
}

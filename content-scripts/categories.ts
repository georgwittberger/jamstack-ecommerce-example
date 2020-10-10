import { existsSync, mkdirSync, writeFileSync } from 'fs'
import * as path from 'path'
import rimraf from 'rimraf'
import log from './logger'
import { executeSoqlQuery } from './salesforce-api'

export async function updateCategoriesContent(
  accessToken: string
): Promise<Category[]> {
  log.info('Removing old category content files...')
  await deleteCategoriesContentFiles()
  log.info('Category content files removed.')

  log.info('Requesting new category content...')
  const categoriesSoqlQuery = `SELECT Name, jsec_Description__c FROM jsec_ProductCategory__c`
  const categoriesQueryResult = await executeSoqlQuery(
    categoriesSoqlQuery,
    accessToken
  )
  log.info('Category content received.')

  const categories = createCategoriesContent(categoriesQueryResult)
  categories.push(otherCategory)

  log.info('Writing new category content files...')
  const categoriesContentPath = createCategoriesContentPath()
  categories.forEach((category) => {
    const categoryFilePath = path.resolve(
      categoriesContentPath,
      `${getCategorySlug(category.name)}.json`
    )
    writeFileSync(categoryFilePath, JSON.stringify(category, null, 2), 'utf8')
    log.info('Written: %s', categoryFilePath)
  })

  log.info(
    'Category content files updated. Number of categories: %d',
    categories.length
  )
  return categories
}

function deleteCategoriesContentFiles(): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    rimraf(path.resolve(getCategoriesContentPath(), '*.json'), (error) => {
      if (!error) resolve()
      else reject(error)
    })
  )
}

function createCategoriesContent(categoriesQueryResult: any): Category[] {
  if (!categoriesQueryResult?.records) return []
  const records: any[] = categoriesQueryResult.records
  return records.map(convertRecordToCategory)
}

function convertRecordToCategory(record: any): Category {
  return {
    name: record.Name,
    description: record.jsec_Description__c,
  }
}

function createCategoriesContentPath(): string {
  const categoriesContentPath = getCategoriesContentPath()
  if (!existsSync(categoriesContentPath)) {
    mkdirSync(categoriesContentPath, { recursive: true })
  }
  return categoriesContentPath
}

export function getCategoriesContentPath(): string {
  return path.resolve(__dirname, '../content/categories')
}

export function getCategorySlug(categoryName: string): string {
  return categoryName.replace(/[^\w]|_/g, '-').toLowerCase()
}

export const otherCategory: Category = {
  name: 'Other',
  description: 'Other products we have to offer',
}

export type Category = {
  name: string
  description: string
}

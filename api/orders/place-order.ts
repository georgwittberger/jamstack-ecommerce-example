import { getContactInfo } from '../contact-info/get-contact-info'
import { ContactInfo } from '../contact-info/types'
import {
  executeSoqlQuery,
  getRecordById,
  insertOrder,
} from '../salesforce/adapter'
import { InsertOrderResult, SoqlQueryResult } from '../salesforce/types'
import { Order, OrderConfiguration, OrderItem } from './types'

const standardPriceBookName =
  process.env.SALESFORCE_PRICE_BOOK_NAME || 'Standard Price Book'

export async function placeOrder(
  authorization: string,
  configuration: OrderConfiguration,
  orderItems: OrderItem[]
): Promise<Order> {
  /*
   * Note that this complicated REST API orchestration is only used in this
   * example to keep prerequisites for the Salesforce org at a minimum. In
   * a real-world project the whole order with all its items should be sent
   * to an Apex REST class and records should be created on Salesforce side.
   */

  const orderItemsProductIds: string = orderItems
    .map((orderItem) => `'${orderItem.productId}'`)
    .join(',')
  const [contactInfo, priceBookQueryResult] = await Promise.all([
    getContactInfo(authorization),
    executeSoqlQuery<PriceBookQueryResult>(
      `SELECT Id, (SELECT Id,Product2Id,UnitPrice FROM PricebookEntries WHERE Product2Id IN (${orderItemsProductIds})) FROM Pricebook2 WHERE Name = '${standardPriceBookName}'`
    ),
  ])
  const priceBookRecord = getPriceBookRecord(priceBookQueryResult)
  const productPriceBookEntries = getProductPriceBookEntries(priceBookRecord)

  const orderRecord = createOrderRecord(
    contactInfo,
    configuration,
    priceBookRecord.Id
  )
  const orderItemRecords = orderItems.map((orderItem) =>
    createOrderItemRecord(
      orderItem,
      productPriceBookEntries.get(orderItem.productId)
    )
  )

  const orderInsertResult = await insertOrder(orderRecord, orderItemRecords)
  const orderId = getOrderId(orderInsertResult)

  const { OrderNumber } = await getRecordById<OrderNumberQueryResult>(
    'Order',
    orderId,
    ['OrderNumber']
  )
  return { number: OrderNumber }
}

function getPriceBookRecord(
  priceBookQueryResult: SoqlQueryResult<PriceBookQueryResult>
): PriceBookQueryResult {
  if (!priceBookQueryResult?.records?.length) {
    throw new Error('No standard price book found')
  }
  return priceBookQueryResult.records[0]
}

function createOrderRecord(
  contactInfo: ContactInfo,
  configuration: OrderConfiguration,
  priceBookId: string
): SalesforceOrderPrototype {
  const orderISODate: string = new Date().toISOString().substr(0, 10)
  return {
    AccountId: contactInfo.company.id,
    CustomerAuthorizedById: contactInfo.person.id,
    CustomerAuthorizedDate: orderISODate,
    EffectiveDate: orderISODate,
    Status: 'Draft',
    Pricebook2Id: priceBookId,
    OrderReferenceNumber: configuration.orderReferenceNumber,
    BillingStreet: contactInfo.company.billingAddress.street,
    BillingPostalCode: contactInfo.company.billingAddress.postalCode,
    BillingCity: contactInfo.company.billingAddress.city,
    BillingCountry: contactInfo.company.billingAddress.country,
    ShippingStreet: contactInfo.company.billingAddress.street,
    ShippingPostalCode: contactInfo.company.billingAddress.postalCode,
    ShippingCity: contactInfo.company.billingAddress.city,
    ShippingCountry: contactInfo.company.billingAddress.country,
    ShipToContactId: contactInfo.person.id,
  }
}

function getProductPriceBookEntries(
  priceBookRecord: PriceBookQueryResult
): Map<string, PriceBookEntryQueryResult> {
  if (!priceBookRecord?.PricebookEntries?.records) {
    throw new Error('No price book entries found')
  }
  const productPrices = new Map<string, PriceBookEntryQueryResult>()
  priceBookRecord.PricebookEntries.records.forEach((priceBookEntry) => {
    productPrices.set(priceBookEntry.Product2Id, priceBookEntry)
  })
  return productPrices
}

function createOrderItemRecord(
  orderItem: OrderItem,
  productPriceBookEntry?: PriceBookEntryQueryResult
): SalesforceOrderItemPrototype {
  if (!productPriceBookEntry) {
    throw new Error(`No price book entry for product ${orderItem.productId}`)
  }
  return {
    Product2Id: orderItem.productId,
    Quantity: orderItem.quantity,
    PricebookEntryId: productPriceBookEntry.Id,
    ListPrice: productPriceBookEntry.UnitPrice,
    UnitPrice: productPriceBookEntry.UnitPrice,
  }
}

function getOrderId(orderInsertResult: InsertOrderResult): string {
  if (!orderInsertResult?.records?.length) {
    throw new Error('Order insert result does not contain any record')
  }
  return orderInsertResult.records[0].Id
}

type PriceBookQueryResult = {
  Id: string
  PricebookEntries?: SoqlQueryResult<PriceBookEntryQueryResult>
}

type PriceBookEntryQueryResult = {
  Id: string
  Product2Id: string
  UnitPrice: number
}

type SalesforceOrderPrototype = {
  AccountId: string
  CustomerAuthorizedById?: string
  CustomerAuthorizedDate?: string
  EffectiveDate: string
  Status: 'Draft'
  Pricebook2Id: string
  OrderReferenceNumber?: string
  BillingStreet?: string
  BillingPostalCode?: string
  BillingCity?: string
  BillingCountry?: string
  ShippingStreet?: string
  ShippingPostalCode?: string
  ShippingCity?: string
  ShippingCountry?: string
  ShipToContactId?: string
}

type SalesforceOrderItemPrototype = {
  Product2Id: string
  Quantity: number
  PricebookEntryId: string
  ListPrice: number
  UnitPrice: number
}

type OrderNumberQueryResult = {
  OrderNumber: string
}

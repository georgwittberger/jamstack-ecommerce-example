import Router from '@koa/router'
import { getContactInfo, ContactInfo } from './contact-info'
import { insertOrder, executeSoqlQuery, getRecordById } from './salesforce-api'

const standardPriceBookName =
  process.env.SALESFORCE_PRICE_BOOK_NAME || 'Standard Price Book'

export function createOrdersRouter(): Router {
  const router = new Router()
  router.post('/', async (ctx) => {
    const authorization = ctx.request.get('Authorization')
    const order = await placeOrder(
      authorization,
      ctx.request.body.configuration,
      ctx.request.body.orderItems
    )
    ctx.response.status = 200
    ctx.response.body = order
  })
  return router
}

async function placeOrder(
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
    executeSoqlQuery(
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

  const { OrderNumber } = await getRecordById('Order', orderId, ['OrderNumber'])
  return { number: OrderNumber }
}

function getPriceBookRecord(priceBookQueryResult: any): any {
  if (!priceBookQueryResult?.records?.length) {
    throw new Error('No standard price book found')
  }
  return priceBookQueryResult.records[0]
}

function createOrderRecord(
  contactInfo: ContactInfo,
  configuration: OrderConfiguration,
  priceBookId: string
): any {
  const orderISODate: string = new Date().toISOString().substr(0, 10)
  return {
    AccountId: contactInfo.company.id,
    CustomerAuthorizedById: contactInfo.person.id,
    CustomerAuthorizedDate: orderISODate,
    EffectiveDate: orderISODate,
    Status: 'Draft',
    Pricebook2Id: priceBookId,
    OrderReferenceNumber: configuration.orderReferenceNumber || null,
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

function getProductPriceBookEntries(priceBookRecord: any): Map<string, any> {
  if (!priceBookRecord?.PricebookEntries?.records) {
    throw new Error('No price book entries found')
  }
  const productPrices = new Map<string, number>()
  priceBookRecord.PricebookEntries.records.forEach((priceBookEntry: any) => {
    productPrices.set(priceBookEntry.Product2Id, priceBookEntry)
  })
  return productPrices
}

function createOrderItemRecord(
  orderItem: OrderItem,
  productPriceBookEntry: any
): any {
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

function getOrderId(orderInsertResult: any): string {
  if (!orderInsertResult?.records?.length) {
    throw new Error('Order insert result does not contain any record')
  }
  return orderInsertResult.records[0].Id
}

interface OrderConfiguration {
  orderReferenceNumber?: string
}

interface OrderItem {
  productId: string
  quantity: number
}

interface Order {
  number: string
}

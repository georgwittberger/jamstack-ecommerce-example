import Router from '@koa/router'
import { getUserInfo } from './user-info'
import { executeSoqlQuery } from './salesforce-api'

export function createContactInfoRouter(): Router {
  const router = new Router()
  router.get('/', async (ctx) => {
    const authorization = ctx.request.get('Authorization')
    const contactInfo = await getContactInfo(authorization)
    ctx.response.status = 200
    ctx.response.body = contactInfo
  })
  return router
}

export async function getContactInfo(
  authorization: string
): Promise<ContactInfo> {
  const { user_id } = await getUserInfo(authorization)
  if (!user_id) {
    throw new Error('User info does not contain user ID')
  }
  const soqlQuery = `SELECT Contact.Id,Contact.FirstName,Contact.LastName,Account.Id,Account.Name,Account.AccountNumber,Account.BillingAddress FROM User WHERE Id='${user_id}'`
  const contactQueryResult = await executeSoqlQuery(soqlQuery)
  return createContactInfo(contactQueryResult)
}

function createContactInfo(contactQueryResult: any) {
  if (!contactQueryResult?.records?.length) {
    throw new Error('No user record found')
  }
  const contact = contactQueryResult.records[0].Contact
  if (!contact) {
    throw new Error('No contact record associated with user')
  }
  const account = contactQueryResult.records[0].Account
  if (!account) {
    throw new Error('No account record associated with user')
  }
  const contactInfo: ContactInfo = {
    person: {
      id: contact.Id,
      firstName: contact.FirstName,
      lastName: contact.LastName,
    },
    company: {
      id: account.Id,
      name: account.Name,
      number: account.AccountNumber,
      billingAddress: {
        street: account.BillingAddress?.street,
        postalCode: account.BillingAddress.postalCode,
        city: account.BillingAddress.city,
        country: account.BillingAddress.country,
      },
    },
  }
  return contactInfo
}

export interface ContactInfo {
  person: {
    id: string
    firstName?: string
    lastName: string
  }
  company: {
    id: string
    name: string
    number: string
    billingAddress: {
      street: string
      postalCode: string
      city: string
      country: string
    }
  }
}

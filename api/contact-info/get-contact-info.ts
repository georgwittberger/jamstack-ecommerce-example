import { executeSoqlQuery } from '../salesforce/adapter'
import { SoqlQueryResult } from '../salesforce/types'
import { ContactInfo } from './types'

export async function getContactInfo(userId: string): Promise<ContactInfo> {
  if (!userId) {
    throw new Error('Missing user ID argument')
  }
  const soqlQuery = `SELECT Contact.Id,Contact.FirstName,Contact.LastName,Account.Id,Account.Name,Account.AccountNumber,Account.BillingAddress FROM User WHERE Id='${userId}'`
  const userQueryResult = await executeSoqlQuery<UserQueryResult>(soqlQuery)
  return createContactInfo(userQueryResult)
}

function createContactInfo(
  userQueryResult: SoqlQueryResult<UserQueryResult>
): ContactInfo {
  if (!userQueryResult?.records?.length) {
    throw new Error('No user record found')
  }
  const contact = userQueryResult.records[0].Contact
  if (!contact) {
    throw new Error('No contact record associated with user')
  }
  const account = userQueryResult.records[0].Account
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
        postalCode: account.BillingAddress?.postalCode,
        city: account.BillingAddress?.city,
        country: account.BillingAddress?.country,
      },
    },
  }
  return contactInfo
}

type UserQueryResult = {
  Contact?: {
    Id: string
    FirstName?: string
    LastName: string
  }
  Account?: {
    Id: string
    Name: string
    AccountNumber?: string
    BillingAddress?: {
      street?: string
      postalCode?: string
      city?: string
      country?: string
    }
  }
}

import Router from '@koa/router'
import { getUserInfo } from './user-info'
import { executeSoqlQuery } from './salesforce-api'

export function createCompanyInfoRouter(): Router {
  const router = new Router()
  router.get('/', async (ctx) => {
    const authorization = ctx.request.get('Authorization')
    if (!authorization) {
      ctx.response.status = 401
      ctx.response.body = { status: 401, message: 'Missing authorization' }
    }
    const companyInfo = await getCompanyInfo(authorization)
    ctx.response.status = 200
    ctx.response.body = companyInfo
  })
  return router
}

export async function getCompanyInfo(
  authorization: string
): Promise<CompanyInfo> {
  const { user_id } = await getUserInfo(authorization)
  if (!user_id) {
    throw new Error('User info does not contain user ID')
  }
  const soqlQuery = `SELECT Account.Name,Account.AccountNumber,Account.BillingAddress FROM User WHERE Id='${user_id}'`
  const companyQueryResult = await executeSoqlQuery(soqlQuery)
  return createCompanyInfo(companyQueryResult)
}

function createCompanyInfo(companyQueryResult: any) {
  if (!companyQueryResult.records || companyQueryResult.records.length < 1) {
    throw new Error('No user record found')
  }
  const account = companyQueryResult.records[0].Account
  if (!account) {
    throw new Error('No account record associated with user')
  }
  const companyInfo: CompanyInfo = {
    name: account.Name,
    number: account.AccountNumber,
    billingAddress: {
      street: account.BillingAddress?.street,
      postalCode: account.BillingAddress.postalCode,
      city: account.BillingAddress.city,
      country: account.BillingAddress.country,
    },
  }
  return companyInfo
}

interface CompanyInfo {
  name: string
  number: string
  billingAddress: {
    street: string
    postalCode: string
    city: string
    country: string
  }
}

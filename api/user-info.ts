import Router from '@koa/router'
import axios from 'axios'

export function createUserInfoRouter(): Router {
  const router = new Router()
  router.get('/', async (ctx) => {
    const authorization = ctx.request.get('Authorization')
    if (!authorization) {
      ctx.response.status = 401
      ctx.response.body = { status: 401, message: 'Missing authorization' }
    }
    const userInfo = await getUserInfo(authorization)
    ctx.response.status = 200
    ctx.response.body = userInfo
  })
  return router
}

export async function getUserInfo(authorization: string): Promise<any> {
  const endpoint = process.env.SALESFORCE_USERINFO_ENDPOINT
  if (!endpoint) {
    throw new Error(
      'No user info endpoint defined. Please set environment variable SALESFORCE_USERINFO_ENDPOINT'
    )
  }
  const response = await axios.get(endpoint, {
    headers: {
      Accept: 'application/json',
      Authorization: authorization,
    },
  })
  return response.data
}

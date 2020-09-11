import Router from '@koa/router'
import { getUserInfo } from '../user-info/get-user-info'
import { getContactInfo } from './get-contact-info'

export function createContactInfoRouter(): Router {
  const router = new Router()
  router.get('/', async (ctx) => {
    try {
      const userInfo = getUserInfo(ctx)
      const contactInfo = await getContactInfo(userInfo.user_id)
      ctx.response.status = 200
      ctx.response.body = contactInfo
    } catch (error) {
      ctx.response.status = 500
      ctx.response.body = { error: (error as Error).message }
    }
  })
  return router
}

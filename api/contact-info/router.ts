import Router from '@koa/router'
import { getContactInfo } from './get-contact-info'

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

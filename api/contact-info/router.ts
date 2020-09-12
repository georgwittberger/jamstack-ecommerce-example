import Router from '@koa/router'
import log from '../global-logger'
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
      log.info(
        { userSub: ctx.state.user.sub },
        'Return contact info for user Id %s',
        userInfo.user_id
      )
    } catch (error) {
      ctx.response.status = 500
      ctx.response.body = { error: (error as Error).message }
      log.error(
        { userSub: ctx.state.user.sub },
        'Error loading contact info: %o',
        error
      )
    }
  })
  return router
}

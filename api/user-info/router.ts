import Router from '@koa/router'
import log from '../global-logger'
import { getUserInfo } from './get-user-info'

export function createUserInfoRouter(): Router {
  const router = new Router()
  router.get('/', async (ctx) => {
    try {
      const userInfo = getUserInfo(ctx)
      ctx.response.status = 200
      ctx.response.body = userInfo
      log.info(
        { userSub: ctx.state.user.sub },
        'Return user info for user Id %s',
        userInfo.user_id
      )
    } catch (error) {
      ctx.response.status = 500
      ctx.response.body = { error: (error as Error).message }
      log.error(
        { userSub: ctx.state.user.sub },
        'Error loading user info: %o',
        error
      )
    }
  })
  return router
}

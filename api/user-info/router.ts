import Router from '@koa/router'
import { getUserInfo } from './get-user-info'

export function createUserInfoRouter(): Router {
  const router = new Router()
  router.get('/', async (ctx) => {
    try {
      const userInfo = getUserInfo(ctx)
      ctx.response.status = 200
      ctx.response.body = userInfo
    } catch (error) {
      ctx.response.status = 500
      ctx.response.body = { error: (error as Error).message }
    }
  })
  return router
}

import Router from '@koa/router'
import { getUserInfo } from './get-user-info'

export function createUserInfoRouter(): Router {
  const router = new Router()
  router.get('/', async (ctx) => {
    const authorization = ctx.request.get('Authorization')
    const userInfo = await getUserInfo(authorization)
    ctx.response.status = 200
    ctx.response.body = userInfo
  })
  return router
}

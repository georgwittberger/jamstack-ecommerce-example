import Router from '@koa/router'
import { placeOrder } from './place-order'

export function createOrdersRouter(): Router {
  const router = new Router()
  router.post('/', async (ctx) => {
    const authorization = ctx.request.get('Authorization')
    const order = await placeOrder(
      authorization,
      ctx.request.body.configuration,
      ctx.request.body.orderItems
    )
    ctx.response.status = 200
    ctx.response.body = order
  })
  return router
}

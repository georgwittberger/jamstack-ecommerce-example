import Router from '@koa/router'
import log from '../global-logger'
import { getUserInfo } from '../user-info/get-user-info'
import { placeOrder } from './place-order'

export function createOrdersRouter(): Router {
  const router = new Router()
  router.post('/', async (ctx) => {
    try {
      const userInfo = getUserInfo(ctx)
      const order = await placeOrder(
        userInfo.user_id,
        ctx.request.body.configuration,
        ctx.request.body.orderItems
      )
      ctx.response.status = 200
      ctx.response.body = order
      log.info(
        { userSub: ctx.state.user.sub, orderNo: order.number },
        'Order created for user Id %s: %s',
        userInfo.user_id,
        order.number
      )
    } catch (error) {
      ctx.response.status = 500
      ctx.response.body = { error: (error as Error).message }
      log.error(
        { userSub: ctx.state.user.sub },
        'Error creating order: %o',
        error
      )
    }
  })
  return router
}

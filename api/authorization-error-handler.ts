import {
  DefaultContext,
  DefaultState,
  Middleware,
  ParameterizedContext,
} from 'koa'

const authorizationErrorHandler: Middleware<ParameterizedContext<
  DefaultState,
  DefaultContext
>> = (ctx, next) => {
  return next().catch((error) => {
    if (error.status === 401) {
      ctx.status = 401
      ctx.body = {
        error:
          'Access to this resource requires a valid ID token to be sent in the Authorization header',
      }
    } else {
      throw error
    }
  })
}

export default authorizationErrorHandler

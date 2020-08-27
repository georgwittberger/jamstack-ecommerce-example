import Koa, { ParameterizedContext } from 'koa'

export default function authorizationFilter() {
  return async function (
    ctx: ParameterizedContext,
    next: Koa.Next
  ): Promise<void> {
    const authorization = ctx.request.get('Authorization')
    if (
      ctx.request.method.toLowerCase() !== 'options' &&
      (!authorization || !authorization.match(/^bearer\s+.+/i))
    ) {
      ctx.response.status = 401
      ctx.response.body = { status: 401, message: 'Missing authorization' }
      return
    }
    await next()
  }
}

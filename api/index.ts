import 'dotenv/config'
import cors from '@koa/cors'
import Router from '@koa/router'
import { koaJwtSecret } from 'jwks-rsa'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import jwt from 'koa-jwt'
import ms from 'ms'
import authorizationErrorHandler from './authorization-error-handler'
import { createContactInfoRouter } from './contact-info/router'
import { createOrdersRouter } from './orders/router'
import { createUserInfoRouter } from './user-info/router'

const port = process.env.PORT || 3000
const app = new Koa()
const router = new Router()
const userInfoRouter = createUserInfoRouter()
const contactInfoRouter = createContactInfoRouter()
const ordersRouter = createOrdersRouter()

router.use(
  '/userinfo',
  userInfoRouter.routes(),
  userInfoRouter.allowedMethods()
)
router.use(
  '/contactinfo',
  contactInfoRouter.routes(),
  contactInfoRouter.allowedMethods()
)
router.use('/orders', ordersRouter.routes(), ordersRouter.allowedMethods())

app.use(authorizationErrorHandler)
app.use(cors({ origin: process.env.SECURITY_CORS_ORIGIN, credentials: true }))
app.use(
  jwt({
    secret: koaJwtSecret({
      jwksUri: process.env.SALESFORCE_JWKS_ENDPOINT || '',
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: ms('24h'),
    }),
    audience: process.env.SALESFORCE_CLIENT_ID,
    issuer: process.env.SALESFORCE_ISSUER_URL,
  })
)
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())
app.listen(port)
console.info(`Server listening on port ${port}`)

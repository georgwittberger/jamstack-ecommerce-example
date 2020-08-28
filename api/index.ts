import 'dotenv/config'
import cors from '@koa/cors'
import Router from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import authorizationFilter from './authorization-filter'
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

app.use(cors({ origin: process.env.SECURITY_CORS_ORIGIN, credentials: true }))
app.use(authorizationFilter())
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())
app.listen(port)
console.info(`Server listening on port ${port}`)

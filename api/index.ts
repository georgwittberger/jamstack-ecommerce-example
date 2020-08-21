import 'dotenv/config'
import Koa from 'koa'
import Router from '@koa/router'
import cors from '@koa/cors'
import { createUserInfoRouter } from './user-info'

const port = process.env.PORT || 3000
const app = new Koa()
const router = new Router()
const userInfoRouter = createUserInfoRouter()

router.use(
  '/userinfo',
  userInfoRouter.routes(),
  userInfoRouter.allowedMethods()
)

app.use(cors({ origin: process.env.SECURITY_CORS_ORIGIN, credentials: true }))
app.use(router.routes()).use(router.allowedMethods())
app.listen(port)
console.info(`Server listening on port ${port}`)

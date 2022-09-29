import { Router } from 'express'
import { adaptRoute } from '@/main/adapter/express-route-adapter'
import { makeRegisterUserController } from '@/main/factories/register'

export default (router: Router): void => {
  router.post('/register', adaptRoute(makeRegisterUserController()))
}

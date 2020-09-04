import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factores/signup/signup-factory'
import { makeLoginController } from '../factores/login/login-factory'

export default (router: Router): void => {
  router.post('/signup',adaptRoute(makeSignUpController()))
  router.post('/login',adaptRoute(makeLoginController()))
}

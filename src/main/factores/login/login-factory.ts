import env from '../../config/env'
import { Controller } from '../../../presentation/protocols'
import { LoginController } from '../../../presentation/controller/login/login-controller'
import { LogMongoRepository } from '../../../infra/log/log-mongo-repository'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { BcrypterAdapter } from '../../../infra/criptography/bcrypt-adatper/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { JwtAdatper } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { DbAuthentication } from '../../../data/usercases/authentication/db-authentication'
import { makeLoginValidations } from './login-validations-factory'

export const makeLoginController = (): Controller => {
  const bcryptAdapter = new BcrypterAdapter(env.salt)
  const jwtAdapter = new JwtAdatper(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
  const loginController = new LoginController(dbAuthentication, makeLoginValidations())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}

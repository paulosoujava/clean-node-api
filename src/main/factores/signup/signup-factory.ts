import env from '../../config/env'
import { SignUpController } from '../../../presentation/controller/signup/signup-controller'
import { DbAddAccount } from '../../../data/usercases/add-account/db-add-account'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/log/log-mongo-repository'
import { BcrypterAdapter } from '../../../infra/criptography/bcrypt-adatper/bcrypt-adapter'
import { makeSignUpValidations } from '../login/login'

export const makeSignUpController = (): Controller => {
  const salt = env.salt
  const bcryptAdapter = new BcrypterAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter,accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidations())
  const log = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, log)
}

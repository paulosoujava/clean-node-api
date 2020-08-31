import { SignUpController } from '../../../presentation/controller/signup/signup'
import { DbAddAccount } from '../../../data/usercases/add-account/db-add-account'
import { BcrypterAdapter } from '../../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import env from '../../config/env'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { LogMongoRepository } from '../../../infra/log-repository/log'
import { makeSignUpValidations } from './signup-validations'

export const makeSignUpController = (): Controller => {
  const salt = env.salt
  const bcryptAdapter = new BcrypterAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter,accountMongoRepository)
  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidations())
  const log = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, log)
}

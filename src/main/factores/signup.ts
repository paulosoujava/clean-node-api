import { SignUpController } from '../../presentation/controller/signup/signup'
import { EmailValidatorAdpter } from '../../util/email-validator-adapter'
import { DbAddAccount } from '../../data/usercases/add-account/db-add-account'
import { BcrypterAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import env from '../config/env'

export const makeSignUpController = (): SignUpController => {
  const salt = env.salt
  const emailValidtorAdapter = new EmailValidatorAdpter()
  const bcryptAdapter = new BcrypterAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter,accountMongoRepository)
  return new SignUpController(emailValidtorAdapter, dbAddAccount)
}

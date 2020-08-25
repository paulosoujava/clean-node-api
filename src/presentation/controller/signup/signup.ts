import { HttpRequest, HttpResponse, Controller, EmailValidator , AddAccount } from './signup-protocols'
import { badRequest, serverError , ok } from '../../helpers/http-helper'
import { MissingParamError,InvalidParamError } from '../../errors'

export class SignUpController implements Controller {
  private readonly emailValidar: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidar: EmailValidator, addAccount: AddAccount) {
    this.emailValidar = emailValidar
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidar.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
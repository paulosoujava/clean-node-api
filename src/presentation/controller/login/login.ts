import { Controller, HttpResponse, HttpRequest } from '../../protocols'
import { badRequest, MissingParamError, InvalidParamError, serverError, unauthorized, ok } from '../../errors'
import { EmailValidator } from '../signup/signup-protocols'
import { Authentication } from '../../../domain/usecases/authentication'

export class LoginController implements Controller {
  private readonly emailValidor: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidor: EmailValidator, authentication: Authentication) {
    this.emailValidor = emailValidor
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email','password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body

      const isVaLid = this.emailValidor.isValid(email)
      if (!isVaLid) {
        return badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}

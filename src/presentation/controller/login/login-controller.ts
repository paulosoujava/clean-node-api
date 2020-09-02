import { Controller, HttpResponse, HttpRequest } from '../../protocols'
import { badRequest, serverError, unauthorized, ok } from '../../errors'
import { Authentication } from '../../../domain/usecases/authentication'
import { Validation } from '../../protocols/validation'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication,
    private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body

      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}

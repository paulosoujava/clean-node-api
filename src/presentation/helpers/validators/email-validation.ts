import { Validation } from './validation'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

export class EmailFieldValidation implements Validation {
  private readonly email: string
  private readonly emailValidator: EmailValidator

  constructor (email: string, emailValidator: EmailValidator) {
    this.email = email
    this.emailValidator = emailValidator
  }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.email])
    if (!isValid) {
      return new InvalidParamError(this.email)
    }
  }
}

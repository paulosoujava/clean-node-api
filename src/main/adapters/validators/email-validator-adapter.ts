
import validator from 'validator'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

export class EmailValidatorAdpter implements EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}

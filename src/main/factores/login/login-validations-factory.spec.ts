import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { Validation } from '../../../presentation/protocols/validation'
import { makeLoginValidations } from './login-validations-factory'

jest.mock('../../../presentation/helpers/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('Login Validate Factory', () => {
  test('Should call validationComposite with all validations', () => {
    makeLoginValidations()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailFieldValidation('email',makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})

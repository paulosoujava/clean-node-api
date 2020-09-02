import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { CompareFieldValidation } from '../../../presentation/helpers/validators/compare-field-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { Validation } from '../../../presentation/protocols/validation'
import { makeSignUpValidations } from '../login/login'

jest.mock('../../../presentation/helpers/validators/validation-composite')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
describe('SignUpValidation Factory', () => {
  test('Should call validationCOmposite with all validations', () => {
    makeSignUpValidations()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    validations.push(new EmailFieldValidation('email',makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})

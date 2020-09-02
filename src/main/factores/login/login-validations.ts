import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { EmailFieldValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdpter } from '../../../util/email-validator-adapter'
import { Validation } from '../../../presentation/protocols/validation'

export const makeLoginValidations = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailFieldValidation('email', new EmailValidatorAdpter()))
  return new ValidationComposite(validations)
}

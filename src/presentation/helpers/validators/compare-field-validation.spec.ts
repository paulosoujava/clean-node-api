import { InvalidParamError } from '../../errors'
import { CompareFieldValidation } from './compare-field-validation'

describe('RequiredField Validation', () => {
  const makeSut = (): CompareFieldValidation => {
    return new CompareFieldValidation('field', 'fieldToCompare')
  }
  test('Should return a InvalidParamErro if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_name',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
  test('Should not return if validation succeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_name',
      fieldToCompare: 'any_name'
    })
    expect(error).toBeFalsy()
  })
})

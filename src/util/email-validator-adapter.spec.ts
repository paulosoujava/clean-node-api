import { EmailValidatorAdpter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))
const makeSut = (): EmailValidatorAdpter => {
  return new EmailValidatorAdpter()
}

describe('EmailValidator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid@email.com')
    expect(isValid).toBe(false)
  })
  test('should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid@email.com')
    expect(isValid).toBe(true)
  })
  test('should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid@email.com')
    expect(isEmailSpy).toHaveBeenCalledWith('valid@email.com')
  })
})

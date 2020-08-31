import { LoginController } from './login'
import { badRequest, MissingParamError, serverError, unauthorized, ok } from '../../errors'
import { HttpRequest } from '../signup/signup-protocols'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { Validation } from '../../protocols/validation'

const makeValidation = (): Validation => {
  class EmailValidatorStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new EmailValidatorStub()
}
const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    password: 'any_password',
    email: 'any_email@email.com'
  }

})
describe('Login Controller', () => {
  test('should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toBeCalledWith({
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
  test('should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
  test('Should call validation with correct value',async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const htttpRequest = makeFakeRequest()
    await sut.handle(htttpRequest)
    expect(validateSpy).toHaveBeenCalledWith(htttpRequest.body)
  })
  test('Should return 400 if validation returns an error',async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const htttpRequest = makeFakeRequest()
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})

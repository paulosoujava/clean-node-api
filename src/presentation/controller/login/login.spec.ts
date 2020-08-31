import { LoginController } from './login'
import { badRequest, MissingParamError, InvalidParamError, serverError, unauthorized, ok } from '../../errors'
import { EmailValidator, HttpRequest } from '../signup/signup-protocols'
import { Authentication } from '../../../domain/usecases/authentication'

const makeEmailVAlidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeEmailAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

interface SutTypes {
  sut: LoginController
  emailvalidatorStub: EmailValidator
  authenticationStub: Authentication
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeEmailAuthentication()
  const emailvalidatorStub = makeEmailVAlidator()
  const sut = new LoginController(emailvalidatorStub,authenticationStub)
  return {
    sut,
    emailvalidatorStub,
    authenticationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    password: 'any_password',
    email: 'any_email@email.com'
  }

})
describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        passaword: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailvalidatorStub } = makeSut()
    jest.spyOn(emailvalidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('should call emailvalidator', async () => {
    const { sut, emailvalidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailvalidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('any_email@email.com')
  })
  test('should return 500 if emailValidator throws', async () => {
    const { sut, emailvalidatorStub } = makeSut()
    jest.spyOn(emailvalidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toBeCalledWith('any_email@email.com','any_password')
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
  test('should return 200 if valid credentials are rpovided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})

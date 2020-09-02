
import { Controller, HttpResponse, HttpRequest } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { LogControllerDecorator } from './log'
import { LogErrorRepository } from '../../data/protocols/db/log-error-reporitory'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}
const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httResponse: HttpResponse = {
        statusCode: 200,
        body: {
          email: 'any_emaiL@emailcom',
          name: 'any_name',
          password: 'any_password'
        }
      }
      return new Promise(resolve => resolve(httResponse))
    }
  }

  return new ControllerStub()
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}
describe('Log Controller Decorator', () => {
  test('should call handle controller handle',async () => {
    const { sut, controllerStub } = makeSut()
    const hanldeSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = {
      body: {
        email: 'any_emaiL@emailcom',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(hanldeSpy).toHaveBeenCalledWith(httpRequest)
  })
  test('should return the same result of the controller',async () => {
    const { sut } = makeSut()
    const httpRequest = {
      statusCode: 200,
      body: {
        email: 'any_emaiL@emailcom',
        name: 'any_name',
        password: 'any_password'
      }
    }
    const httprespnse = await sut.handle(httpRequest)
    expect(httprespnse).toEqual(httpRequest)
  })
  test('Should call logrepository with correct error if controller returns return a server error',async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(serverError(fakeError))
      ))
    const htttpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    await sut.handle(htttpRequest)
    expect(logSpy).toHaveBeenLastCalledWith('any_stack')
  })
})

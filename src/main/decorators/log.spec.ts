import { LogControllerDecorator } from './log'
import { Controller, HttpResponse, HttpRequest } from '../../presentation/protocols'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
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
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
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
})

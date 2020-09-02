import { MissingParamError, ServerError, ok, badRequest, serverError } from '../../errors'
import { SignUpController } from './signup-controller'
import { AddAccountModel, AddAccount, AccountModel } from './signup-protocols-controller'
import { HttpRequest } from '../../protocols'
import { Validation } from '../../protocols/validation'

const makeValidation = (): Validation => {
  class EmailValidatorStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'

})
const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should call addAccount with correct values',async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const htttpRequest = makeFakeRequest()
    await sut.handle(htttpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })
  })
  test('Should return 500 if AddAccount throws',async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const htttpRequest = makeFakeRequest()
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(serverError(new ServerError(null)))
  })
  test('Should return 200 if valid data is provided',async () => {
    const { sut } = makeSut()
    const htttpRequest = makeFakeRequest()
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(ok(makeFakeAccount()))
    // expect(httResponse.statusCode).toBe(200)
    // expect(httResponse.body).toEqual(makeFakeAccount())
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

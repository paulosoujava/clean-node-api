
import { MissingParamError, InvalidParamError, ServerError, ok, badRequest, serverError } from '../../errors'
import { SignUpController } from './signup'
import { EmailValidator, AddAccountModel, AddAccount, AccountModel } from './signup-protocols'
import { HttpRequest } from '../../protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
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
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const htttpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('name')))
  })
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const htttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('Should return 400 if no password is provided',async () => {
    const { sut } = makeSut()
    const htttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  test('Should return 400 if no passwordConfirmation is provided',async () => {
    const { sut } = makeSut()
    const htttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'
      }
    }
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })
  test('Should return 400 if invalid email is provided',async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const htttpRequest = makeFakeRequest()
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('Should return 400 if passwordConfiramtion fails', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const htttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'other_password'
      }
    }
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })
  test('Should call EmailValidator woth correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const htttpRequest = makeFakeRequest()
    await sut.handle(htttpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const htttpRequest = makeFakeRequest()
    const httResponse = await sut.handle(htttpRequest)
    expect(httResponse).toEqual(serverError(new ServerError(null)))
  })
  test('Should call addAccount eith correct values',async () => {
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
})

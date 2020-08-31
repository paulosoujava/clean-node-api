import { Validation } from './validation'
import { MissingParamError } from '../../errors'

export class RequiredFieldValidation implements Validation {
  private readonly fileName: string
  constructor (fieldName: string) {
    this.fileName = fieldName
  }

  validate (input: any): Error {
    if (!input[this.fileName]) { return new MissingParamError(this.fileName) }
  }
}

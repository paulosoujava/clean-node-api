import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class RequiredFieldValidation implements Validation {
  private readonly fileName: string
  constructor (fieldName: string) {
    this.fileName = fieldName
  }

  validate (input: any): Error {
    if (!input[this.fileName]) { return new MissingParamError(this.fileName) }
  }
}

import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class CompareFieldValidation implements Validation {
  private readonly fileName: string
  private readonly fieldComapare: string

  constructor (fieldName: string, fieldComapare: string) {
    this.fileName = fieldName
    this.fieldComapare = fieldComapare
  }

  validate (input: any): Error {
    if (input[this.fileName] !== input[this.fieldComapare]) { return new InvalidParamError(this.fieldComapare) }
  }
}

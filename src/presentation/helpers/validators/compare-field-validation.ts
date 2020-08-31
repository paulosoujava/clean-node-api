import { Validation } from './validation'
import { InvalidParamError } from '../../errors'

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

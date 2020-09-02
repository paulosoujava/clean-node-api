import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class CompareFieldValidation implements Validation {
  constructor (private readonly fieldName: string,
    private readonly fieldComapare: string) {}

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldComapare]) { return new InvalidParamError(this.fieldComapare) }
  }
}

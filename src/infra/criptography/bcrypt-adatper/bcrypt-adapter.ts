import bcrypt from 'bcrypt'
import { Hasher } from '../../../data/protocols/criptography/hasher'
import { HasheComparer } from '../../../data/protocols/criptography/hash-comparer'

export class BcrypterAdapter implements Hasher, HasheComparer {
  constructor (private readonly salt: number) {}

  async compare (value: string, hashe: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hashe)
    return isValid
  }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}

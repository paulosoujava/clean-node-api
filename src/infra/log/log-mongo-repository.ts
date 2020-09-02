import { LogErrorRepository } from '../../data/protocols/db/log-error-reporitory'
import { MongoHelper } from '../db/mongodb/helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    await collection.insertOne({
      stack,
      date: new Date()
    })
  }
}

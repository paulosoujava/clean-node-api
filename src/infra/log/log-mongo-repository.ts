import { MongoHelper } from '../db/mongodb/helpers/mongo-helper'
import { LogErrorRepository } from '../../data/protocols/db/log/log-error-reporitory'

export class LogMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    await collection.insertOne({
      stack,
      date: new Date()
    })
  }
}

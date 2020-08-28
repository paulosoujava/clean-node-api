import { MongoHelper } from '../db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let collection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeAll(async () => {
    collection = await MongoHelper.getCollection('errors')
    await collection.deleteMany({})
  })
  test('should create error log on success',async () => {
    const sut = new LogMongoRepository()
    await sut.log('any_Error')
    const count = await collection.countDocuments()
    expect(count).toBe(1)
  })
})

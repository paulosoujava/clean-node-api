import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

// 16 : 35
let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should  return to 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'paulo',
          email: 'paulo@paulo.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('should  return to 200 on login', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'paulo',
        email: 'paulo@paulo.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          name: 'paulo',
          email: 'paulo@paulo.com',
          password: '123'
        })
        .expect(200)
    })

    test('should  return to 401 on login', async () => {
      const password = await hash('1235', 12)
      await accountCollection.insertOne({
        name: 'paulo',
        email: 'paulo@paulo.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'paulo@paulo.com',
          password: '123'
        })
        .expect(401)
    })
  })
})

import { MongoHelper } from '@/external/mongodb/helper'
import { MongodbUserRepository } from '@/external/mongodb'

describe('Mongodb User repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    MongoHelper.clearCollection('users')
  })

  test('when user is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository()
    const user = {
      name: 'any_name',
      email: 'any@mail.com'
    }
    await userRepository.add(user)

    expect(await userRepository.exist(user)).toBeTruthy()
  })

  test('find all users should return all added users', async () => {
    const userRepository = new MongodbUserRepository()
    await userRepository.add({
      name: 'any_name',
      email: 'any@mail.com'
    })
    await userRepository.add({
      name: 'second_name',
      email: 'second@mail.com'
    })
    const users = await userRepository.findAllUser()
    expect(users[0].name).toEqual('any_name')
    expect(users[1].name).toEqual('second_name')
  })
})

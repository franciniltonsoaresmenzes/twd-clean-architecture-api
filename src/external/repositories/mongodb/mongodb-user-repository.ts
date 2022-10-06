import { UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MongoHelper } from './helper'

export class MongodbUserRepository implements UserRepository {
  async add (user: UserData): Promise<void> {
    const userCollection = MongoHelper.getCollection('users')
    const exists = await this.exist(user)

    if (!exists) {
      await userCollection.insertOne(user)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const userCollection = MongoHelper.getCollection('users')
    const result = await userCollection.findOne({ email })
    return result
  }

  async findAllUser (): Promise<UserData[]> {
    const userCollection = await MongoHelper.getCollection('users')
    return await userCollection.find<UserData>({}).toArray()
  }

  async exist (user: UserData): Promise<boolean> {
    const result = await this.findUserByEmail(user.email)
    if (result != null) {
      return true
    }

    return false
  }
}

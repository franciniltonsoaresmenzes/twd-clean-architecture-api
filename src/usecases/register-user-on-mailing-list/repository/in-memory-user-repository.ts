import { UserRepository } from '../ports/use-repository'
import { UserData } from '../use-data'

export class InMemoryUserRepository implements UserRepository {
  private repository: UserData[]

  constructor (repository: UserData[]) {
    this.repository = repository
  }

  async add (user: UserData): Promise<void> {
    throw new Error('method not implement')
  }

  async findUserByEmail (email: string): Promise<UserData> {
    return null
  }

  async findAllUser (): Promise<UserData[]> {
    throw new Error('method not implement')
  }

  async exist (user: UserData): Promise<boolean> {
    throw new Error('method not implement')
  }
}

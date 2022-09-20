import { UserRepository } from '../ports/use-repository'
import { UserData } from '../use-data'

export class InMemoryUserRepository implements UserRepository {
  private repository: UserData[]

  constructor (repository: UserData[]) {
    this.repository = repository
  }

  async add (user: UserData): Promise<void> {
    const exists = await this.exist(user)

    if (!exists) {
      this.repository.push(user)
    }
  }

  async findUserByEmail (email: string): Promise<UserData> {
    const users = this.repository.filter((user) => {
      return user.email === email
    })

    if (users.length > 0) {
      return users[0]
    }

    return null
  }

  async findAllUser (): Promise<UserData[]> {
    return this.repository
  }

  async exist (user: UserData): Promise<boolean> {
    if (await this.findUserByEmail(user.email) === null) {
      return false
    }
    return true
  }
}

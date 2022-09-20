import { UserData } from '../use-data'
import { InMemoryUserRepository } from './in-memory-user-repository'

describe('In memory user repository', () => {
  test('should return null will if user is not found', async () => {
    const users: UserData[] = []
    const userRepo = new InMemoryUserRepository(users)
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  test('should return user if found in the repository', async () => {
    const users: UserData[] = []
    const name = 'any_name'
    const email = 'any@email.com'
    const userRepo = new InMemoryUserRepository(users)
    await userRepo.add({ name, email })
    const user = await userRepo.findUserByEmail('any@email.com')
    expect(user.name).toBe('any_name')
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [{ name: 'any_name', email: 'any@email.com' }, { name: 'second_name', email: 'second@email.com' }]
    const userRepo = new InMemoryUserRepository(users)
    const returnedUsers = userRepo.findAllUser()
    expect((await returnedUsers).length).toBe(2)
  })
})

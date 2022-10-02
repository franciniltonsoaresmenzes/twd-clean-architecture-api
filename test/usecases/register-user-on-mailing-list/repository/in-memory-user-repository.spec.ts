import { UserData } from '@/entities'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'

describe('In memory user repository', () => {
  test('should return null will if user is not found', async () => {
    const users: UserData[] = []
    const sut = new InMemoryUserRepository(users)
    const user = await sut.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  test('should return user if found in the repository', async () => {
    const users: UserData[] = []
    const name = 'any_name'
    const email = 'any@email.com'
    const sut = new InMemoryUserRepository(users)
    await sut.add({ name, email })
    const user = await sut.findUserByEmail('any@email.com')
    expect(user.name).toBe('any_name')
  })

  test('should return all users in the repository', async () => {
    const users: UserData[] = [{ name: 'any_name', email: 'any@email.com' }, { name: 'second_name', email: 'second@email.com' }]
    const sut = new InMemoryUserRepository(users)
    const returnedUsers = sut.findAllUser()
    expect((await returnedUsers).length).toBe(2)
  })
})

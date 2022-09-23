import { InvalidNameError } from '../../entities/errors/invalid-name-error'
import { InvalidEmailError } from '../../entities/invalid-email-error'
import { UserData } from '../../entities/use-data'
import { left } from '../../shared/either'
import { UserRepository } from './ports/use-repository'
import { RegisterUserOnMailingList } from './register-user-on-mailing-list'
import { InMemoryUserRepository } from './repository/in-memory-user-repository'

describe('Register user on mailing list use case', () => {
  test('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const email = 'any@email.com'
    const response = await usecase.registerUserOnMailingList({ name, email })
    const user = repo.findUserByEmail('any@email.com')

    expect((await user).name).toBe('any_name')
    expect(response.value.name).toBe('any_name')
  })

  test('should not add user with invalid e-mail data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const name = 'any_name'
    const invalidEmail = 'invalid_email'
    const response = await usecase.registerUserOnMailingList({ name, email: invalidEmail })
    const user = await repo.findUserByEmail('any@email.com')

    expect(user).toBeNull()
    expect(response).toEqual(left(new InvalidEmailError()))
  })

  test('should not add user with invalid name data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const invalidName = ''
    const email = 'any@email.com'
    const response = await usecase.registerUserOnMailingList({ name: invalidName, email })
    const user = await repo.findUserByEmail('any@email.com')

    expect(user).toBeNull()
    expect(response).toEqual(left(new InvalidNameError()))
  })
})

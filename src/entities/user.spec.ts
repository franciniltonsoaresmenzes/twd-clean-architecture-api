import { left } from '../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { User } from './user'

describe('User domain entites', () => {
  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid-email'
    const error = User.create({ name: 'any_name', email: invalidEmail })
    expect(error).toEqual(left(new InvalidEmailError()))
  })

  test('should not create user with invalid name (two few characters)', () => {
    const invalidName = 'O    '
    const error = User.create({ name: invalidName, email: 'any@email.com' })
    expect(error).toEqual(left(new InvalidNameError()))
  })

  test('should not create user with invalid name (two many characters)', () => {
    const invalidName = 'O'.repeat(257)
    const error = User.create({ name: invalidName, email: 'any@email.com' })
    expect(error).toEqual(left(new InvalidNameError()))
  })
})

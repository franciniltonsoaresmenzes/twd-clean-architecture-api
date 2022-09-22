import { left } from '../shared/either'
import { InvalidEmailError } from './invalid-email-error'
import { User } from './user'

describe('User domain entites', () => {
  test('should not create user with invalid e-mail address', () => {
    const invalidEmail = 'invalid-email'
    const error = User.create({ name: 'any_name', email: invalidEmail })
    expect(error).toEqual(left(new InvalidEmailError()))
  })
})

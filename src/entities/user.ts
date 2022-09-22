import { Either, left } from '../shared/either'
import { Email } from './email'
import { InvalidEmailError } from './invalid-email-error'
import { UserData } from './use-data'

export class User {
  static create (userData: UserData): Either<InvalidEmailError, User> {
    const emailOrError = Email.create(userData.email)

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailError())
    }
  }
}

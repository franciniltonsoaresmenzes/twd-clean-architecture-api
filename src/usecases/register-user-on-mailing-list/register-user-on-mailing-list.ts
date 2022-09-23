import { InvalidNameError } from '../../entities/errors/invalid-name-error'
import { InvalidEmailError } from '../../entities/invalid-email-error'
import { UserData } from '../../entities/use-data'
import { User } from '../../entities/user'
import { Either, left, right } from '../../shared/either'
import { UserRepository } from './ports/use-repository'

export class RegisterUserOnMailingList {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async registerUserOnMailingList (request: UserData): Promise<Either<InvalidNameError, InvalidEmailError | UserData>> {
    const userOrError: Either<InvalidNameError, InvalidEmailError | User> = User.create(request)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    if (!(await this.userRepo.exist(request))) {
      await this.userRepo.add(request)
    }

    return right(request)
  }
}

import { UserData } from '@/entities'
import { UseCase } from '@/usecases/ports'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created, serverError } from '@/web-controllers/util'
import { MissingParamsError } from './erros/missing-params-error'

export class RegisterUserController {
  private readonly usecase: UseCase

  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredParams = ['name', 'email']
      const missingParams = requiredParams.filter((_, id) => !request.body[requiredParams[id]])

      if (missingParams.length) {
        return badRequest(new MissingParamsError(missingParams.join(', ')))
      }

      const userData: UserData = request.body
      const response = await this.usecase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      return created(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}

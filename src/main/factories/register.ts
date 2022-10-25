import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { RegisterAndSendEmailController } from '@/web-controllers'
import { MongodbUserRepository } from '@/external/repositories/mongodb'
import { NodemailerEmailService } from '../mail-services'
import { SendEmail } from '@/usecases/send-email/send-email'
import { getEmailOptions } from '@/main/config/email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

export const makeRegisterAndSendEmailController = (): RegisterAndSendEmailController => {
  const mongoDbUserRepository = new MongodbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongoDbUserRepository)
  const emailService = new NodemailerEmailService()
  const sendEmailUseCase = new SendEmail(getEmailOptions(), emailService)
  const regiterAndSendEmailUseCase = new RegisterAndSendEmail(registerUserOnMailingListUseCase, sendEmailUseCase)
  const registerUserController = new RegisterAndSendEmailController(regiterAndSendEmailUseCase)
  return registerUserController
}

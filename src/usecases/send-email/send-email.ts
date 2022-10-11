import { UserData } from '@/entities'
import { Either } from '@/shared'
import { UseCase } from '@/usecases/ports'
import { MailServiceError } from '../error/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'

export class SendEmail implements UseCase {
  private readonly emailOptions: EmailOptions
  private readonly emailService: EmailService

  constructor (emailOptions: EmailOptions, emailService: EmailService) {
    this.emailOptions = emailOptions
    this.emailService = emailService
  }

  async perform (userData: UserData): Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = 'E aí <b>' + userData.name + '</b>, beleza?'
    const customizedHtml = greetings + '<br><br>' + this.emailOptions.html
    const emailInfo: EmailOptions = {
      ...this.emailOptions,
      to: userData.name + '<' + userData.email + '>',
      html: customizedHtml
    }

    return await this.emailService.send(emailInfo)
  }
}

import { User } from '@/entities'
import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/error/mail-service-error'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { SendEmail } from '@/usecases/send-email/send-email'

const attachmentFilePath = '../resources/text.txt'
const fromName = 'Test'
const fromEmail = 'from_any@mail.com'
const toName = 'any_name'
const toEmail = 'any_email@mail.com'
const subject = 'Test e-mail'
const emailBody = 'Hello world attachment test'
const emailBodyHtml = '<b>Hello world attachment test</b>'
const attachment = [{
  filename: attachmentFilePath,
  contextType: 'text/plain'
}]

const mailOptions: EmailOptions = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
  from: fromName + ' ' + fromEmail,
  to: toName + '<' + toEmail + '>',
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachment
}

class MailServiceStub implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return right(options)
  }
}

class MailServiceErrorStub implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    return left(new MailServiceError())
  }
}
describe('Send email to user', () => {
  it('should email user with valid name and email address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(mailOptions, mailServiceStub)
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = (await useCase.perform(user)).value as EmailOptions

    expect(response.to).toEqual(toName + '<' + toEmail + '>')
  })

  it('should return error when services fail ', async () => {
    const mailServiceErrorStub = new MailServiceErrorStub()
    const useCase = new SendEmail(mailOptions, mailServiceErrorStub)
    const user = User.create({ name: toName, email: toEmail }).value as User
    const response = await useCase.perform(user)

    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})

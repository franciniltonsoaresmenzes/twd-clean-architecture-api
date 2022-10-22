import { UserData } from '@/entities'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/error/mail-service-error'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { SendEmail } from '@/usecases/send-email/send-email'

describe('Register and send email to user', () => {
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

  class MailServiceMock implements EmailService {
    public timesSendWasCalled = 0
    async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
      this.timesSendWasCalled++
      return right(options)
    }
  }

  test('should register user and send him/her an email with valid data', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)

    const name = 'any_name'
    const email = 'any@email.com'
    const response: UserData = (await registerAndEmailUseCase.perform({ name, email })).value as UserData
    const user = repo.findUserByEmail('any@email.com')

    expect((await user).name).toBe('any_name')
    expect(response.name).toBe('any_name')
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
  })

  test('should register user and send him/her an email with invalid mail', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)

    const name = 'any_name'
    const invalidEmail = 'invalid_email'
    const response = (await registerAndEmailUseCase.perform({ name, email: invalidEmail })).value as Error

    expect(response.name).toEqual('InvalidEmailError')
  })

  test('should not register user and send him/her an email with invalid name', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
    const registerAndEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)

    const invalidName = 'a'
    const email = 'invalid_email'
    const response = (await registerAndEmailUseCase.perform({ name: invalidName, email })).value as Error

    expect(response.name).toEqual('InvalidNameError')
  })
})

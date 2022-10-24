import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MissingParamsError } from '@/web-controllers/erros/missing-params-error'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { RegisterAndSendEmailController } from '@/web-controllers/register-user-controller'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { EmailOptions, EmailService } from '@/usecases/send-email/ports/email-service'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/error/mail-service-error'
import { SendEmail } from '@/usecases/send-email/send-email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

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

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const registerUseCase: RegisterUserOnMailingList = new RegisterUserOnMailingList(repo)
  const mailServiceMock = new MailServiceMock()
  const sendEmailUseCase: SendEmail = new SendEmail(mailOptions, mailServiceMock)
  const registerAndEmailUseCase: RegisterAndSendEmail = new RegisterAndSendEmail(registerUseCase, sendEmailUseCase)

  const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(registerAndEmailUseCase)

  class ErrorThrowingCaseStub implements UseCase {
    perform (request: any): Promise<any> {
      throw Error()
    }
  }

  const errorThrowingCaseStub = new ErrorThrowingCaseStub()

  test('Should return status code ok when request contains valid user data ', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@email.com'
      }
    }
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(request.body)
  })

  test('Should return status code 400 when request contains invalid invalid name ', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@email.com'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  test('Should return status code 400 when request contains invalid email ', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any_invalid.com'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithInvalidEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  test('Should return status code 400 when request is missing user name ', async () => {
    const requestWithMissingName: HttpRequest = {
      body: {
        email: 'any@email.com'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingName)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamsError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name.')
  })

  test('Should return status code 400 when request is missing user email ', async () => {
    const requestWithNissingEmail: HttpRequest = {
      body: {
        name: 'Any name'
      }
    }

    const response: HttpResponse = await controller.handle(requestWithNissingEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamsError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: email.')
  })

  test('Should return status code 400 when request is missing user email ', async () => {
    const requestWithMissingNameAndEmail: HttpRequest = {
      body: {
      }
    }

    const response: HttpResponse = await controller.handle(requestWithMissingNameAndEmail)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamsError)
    expect((response.body as Error).message).toEqual('Missing parameter from request: name, email.')
  })

  test('Should return status code 500 server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@email.com'
      }
    }

    const controller: RegisterAndSendEmailController = new RegisterAndSendEmailController(errorThrowingCaseStub)
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})

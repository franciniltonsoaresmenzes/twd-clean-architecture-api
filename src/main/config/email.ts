import { EmailOptions } from '@/usecases/send-email/ports/email-service'

const attachment = [{
  filename: 'text.txt',
  path: '../../resources/text.txt'
}]

export function getEmailOptions (): EmailOptions {
  const from = 'Francinilton | theWiseDev <fransoaresmenzes@gmail.com>'
  const to = ''
  const mailOptions: EmailOptions = {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT),
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from,
    to,
    subject: 'Mensage de teste',
    text: 'Texto de mensagem',
    html: '<b>Texto de mensagem</b>',
    attachment
  }
  return mailOptions
}

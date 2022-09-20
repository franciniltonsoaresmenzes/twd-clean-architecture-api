import { Email } from './email'

describe('Email validation', () => {
  test('should not accept null string', () => {
    const email = null
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept empty string', () => {
    const email = ''
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should accept valid emial', () => {
    const email = 'any@email.com'
    expect(Email.validation(email)).toBeTruthy()
  })

  test('should not accept local part large than 64 chars', () => {
    const email = 'l'.repeat(65) + '@email.com'
    expect(Email.validation(email)).toBeFalsy()
  })
})

import { Email } from '@/entities'

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

  test('should not accept strings part large than 320 chars', () => {
    const email = 'l'.repeat(64) + '@' + 'd'.repeat(128) + '.' + 'd'.repeat(127)
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept domain part large than 255 chars', () => {
    const email = 'local@' + 'd'.repeat(128) + 'd'.repeat(128)
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept local part large than 64 chars', () => {
    const email = 'l'.repeat(65) + '@email.com'
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept local part', () => {
    const email = '@email.com'
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept domain', () => {
    const email = 'any@'
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept domain with local part larger than 63 chars', () => {
    const email = 'any@' + 'd'.repeat(64) + '.com'
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept local parts with invalid char', () => {
    const email = 'any email@mail.com'
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept local parts with two dots', () => {
    const email = 'any..email@mail.com'
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept local parts with ending dot', () => {
    const email = 'any.@mail.com'
    expect(Email.validation(email)).toBeFalsy()
  })

  test('should not accept email without an at-sign', () => {
    const email = 'anymail.com'
    expect(Email.validation(email)).toBeFalsy()
  })
})

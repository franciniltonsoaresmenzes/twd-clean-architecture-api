export class MissingParamsError extends Error {
  public readonly name = 'MissingParamsError'

  constructor (params: string) {
    super(`Missing parameter from request: ${params}.`)
  }
}

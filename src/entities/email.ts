export class Email {
  static validation (email:string): boolean {
    if (!email) {
      return false
    }
    return true
  }
}

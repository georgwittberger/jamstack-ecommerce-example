export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
  get isUnauthorized() {
    return this.status === 401
  }
}

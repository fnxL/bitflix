export class ApiError extends Error {
  statusCode;
  message;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

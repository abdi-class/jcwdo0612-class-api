export class AppError extends Error {
  public rc: number;
  public readonly success: boolean = false;
  public readonly message: string;

  constructor(message: string, rc: number = 500, success: boolean = false) {
    super(message);
    this.rc = rc;
    this.success = success;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

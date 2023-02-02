import { RFC7807Error, RFC7807Response } from './rfc7807.error';

export class InternalServerError extends RFC7807Error {
  status = 500;

  constructor(public error: Error) {
    super(error.message);
  }

  serialize(safeError: boolean): RFC7807Response {
    return {
      ...super.serialize(safeError),
      detail: this.error.message,
      errorName: this.error.name,
      stack: safeError ? undefined : this.error.stack,
    };
  }
}

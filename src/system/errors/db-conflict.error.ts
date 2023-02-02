import { RFC7807Error, RFC7807Response } from './rfc7807.error';

export class DBConflictError extends RFC7807Error {
  status = 409;

  constructor(public error: Error) {
    super('Conflict');
  }

  serialize(safeError: boolean): RFC7807Response {
    return {
      ...super.serialize(safeError),
      detail: 'Entity already exists',
      error: this.error.message,
      stack: safeError ? undefined : this.error.stack,
    };
  }
}

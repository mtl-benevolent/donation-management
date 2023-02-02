import { RFC7807Error, RFC7807Response } from './rfc7807.error';

export type ValidationErrorDetail = {
  [path: string]: string;
};

export class ValidationError extends RFC7807Error {
  status = 400;

  constructor(message: string, public errors: ValidationErrorDetail[]) {
    super(message);
  }

  serialize(safeError: boolean): RFC7807Response {
    return {
      ...super.serialize(safeError),
      errors: this.errors,
    };
  }
}

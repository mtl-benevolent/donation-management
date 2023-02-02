import { RFC7807Error, RFC7807Response } from './rfc7807.error';

export class DBInsertError extends RFC7807Error {
  constructor(public entity: string) {
    super(DBInsertError.name);
  }

  serialize(safeError: boolean): RFC7807Response {
    return {
      ...super.serialize(safeError),
      entity: this.entity,
    };
  }
}

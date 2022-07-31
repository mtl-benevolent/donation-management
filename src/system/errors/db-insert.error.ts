import { RFC7808Error } from './rfc7808.error';

export class DBInsertError extends RFC7808Error {
  constructor(entity: string) {
    super(`An error occured while inserting an entity of type ${entity}`);
  }
}

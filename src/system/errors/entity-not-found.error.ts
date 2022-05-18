import { RFC7808Error } from './rfc7808.error';

export class EntityNotFoundError extends RFC7808Error {
  status = 404;

  constructor(
    entity: string,
    id: string | undefined | null,
    ...query: { field: string; value: any }[]
  ) {
    super(
      id ? `Entity ${entity} with ID ${id}` : `Entity ${entity} was not found`,
      query
    );
  }
}

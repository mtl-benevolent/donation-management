import { RFC7807Error, RFC7807Response } from './rfc7807.error';

type QueryDetail = {
  field: string;
  value: any;
};

export class EntityNotFoundError extends RFC7807Error {
  status = 404;

  details: QueryDetail[];

  constructor(
    entity: string,
    id: string | undefined | null,
    ...query: { field: string; value: any }[]
  ) {
    super(
      id ? `Entity ${entity} with ID ${id}` : `Entity ${entity} was not found`
    );

    this.details = query ?? [];
  }

  serialize(safeError: boolean): RFC7807Response {
    return {
      ...super.serialize(safeError),
      details: this.details,
    };
  }
}

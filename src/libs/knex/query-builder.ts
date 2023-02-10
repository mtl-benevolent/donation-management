import { Knex } from 'knex';
import { getKnex } from './bootstrap';

export type GetQueryBuilder<T extends {}> = () => Promise<
  () => Knex.QueryBuilder<T>
>;

export function makeGetQueryBuilder<T extends {}>(
  table: string
): GetQueryBuilder<T> {
  return async () => {
    // TODO: Implement Unit of Work
    const qb = getKnex().table<T>(table);
    return () => qb;
  };
}

import { Knex } from 'knex';

export type GetQueryBuilder<T> = () => Knex.QueryBuilder<T>;

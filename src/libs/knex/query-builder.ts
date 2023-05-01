import { contexts } from '@/system/context/context';
import { Knex } from 'knex';
import { getLogger } from '../pino/bootstrap';
import { getKnex } from './bootstrap';

const logger = getLogger('query-builder');

export type GetQueryBuilder<T extends {}> = () => Promise<
  () => Knex.QueryBuilder<T>
>;

export function makeGetQueryBuilder<T extends {}>(
  table: string
): GetQueryBuilder<T> {
  return async () => {
    const qb = getKnex().table<T>(table);

    const maybeUnitOfWork = contexts.unitOfWork.getValue();
    if (maybeUnitOfWork) {
      const trx = await maybeUnitOfWork.getTransaction();

      qb.transacting(trx);
      logger.debug({ table }, 'Attached transaction to query builder');
    }

    return () => qb;
  };
}

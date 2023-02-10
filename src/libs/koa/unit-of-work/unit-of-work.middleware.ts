import { Knex } from 'knex';
import { Middleware } from 'koa';
import { getKnex } from '../../knex/bootstrap';
import { withUnitOfWork } from '../../knex/unit-of-work';

export const unitOfWork: (
  isolationLevel?: Knex.IsolationLevels
) => Middleware = (isolationLevel) => async (_, next) => {
  const wrappedNext = withUnitOfWork(next, getKnex, isolationLevel);
  await wrappedNext();
};

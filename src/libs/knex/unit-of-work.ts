import { contexts } from '@/system/context/context';
import {
  makeUnitOfWorkContext,
  UnitOfWorkContext,
} from '@/system/context/unit-of-work-context';
import { Knex } from 'knex';
import { getLogger } from '../pino/bootstrap';

const logger = getLogger('unit-of-work');

export function withUnitOfWork<TFn extends (...params: any[]) => Promise<any>>(
  fn: TFn,
  getKnex: () => Knex,
  isolationLevel?: Knex.IsolationLevels
): TFn {
  const wrapped: any = async (...args: any[]): Promise<any> => {
    const uowContext = makeUnitOfWorkContext(getKnex, isolationLevel);

    const maybePromise = contexts.unitOfWork.withContext(
      uowContext,
      fn
    )(...args);

    try {
      const result = await maybePromise;

      if (uowContext.wasAttached()) {
        const trx = await uowContext.getTransaction();

        if (trx.isCompleted()) {
          logger.debug(
            'Transaction is already completed. Will not attempt to commit.'
          );
        } else {
          await trx.commit();

          logger.debug('Transaction was committed');
        }
      }

      const callbacks = uowContext.getCallbacks('commit');
      for (const cb of callbacks) {
        await cb();
      }

      return result;
    } catch (err: unknown) {
      if (uowContext.wasAttached()) {
        const trx = await uowContext.getTransaction();

        if (trx.isCompleted()) {
          logger.debug(
            'Transaction is already completed. Will not attempt to rollback.'
          );
        } else {
          await trx.rollback();

          logger.debug('Transaction was rolled back');
        }
      }

      const callbacks = uowContext.getCallbacks('rollback');
      for (const cb of callbacks) {
        await cb();
      }

      throw err;
    }
  };

  return wrapped;
}

export function getSafeUnitOfWorkContext(): UnitOfWorkContext {
  const maybeContext = contexts.unitOfWork.getValue();

  if (!maybeContext) {
    throw new Error('No Unit of Work context found');
  }

  return maybeContext;
}

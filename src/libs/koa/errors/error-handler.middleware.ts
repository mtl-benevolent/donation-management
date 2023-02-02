import { Middleware } from 'koa';
import { AppConfig } from '../../../config';
import { DBConflictError } from '../../../system/errors/db-conflict.error';
import { FallbackError } from '../../../system/errors/fallback.error';
import { InternalServerError } from '../../../system/errors/internal-server.error';
import {
  RFC7807Error,
  RFC7807Response,
} from '../../../system/errors/rfc7807.error';

export const errorHandler: (appConfig: AppConfig['koa']) => Middleware =
  (config) => async (ctx, next) => {
    try {
      await next();
    } catch (err: unknown) {
      let response: RFC7807Response;

      if (err instanceof RFC7807Error) {
        response = err.serialize(config.safeErrors);
      } else if (err instanceof Error) {
        const rfcError = handleGenericError(err);
        response = rfcError.serialize(config.safeErrors);
      } else {
        response = new FallbackError(err).serialize(config.safeErrors);
      }

      ctx.status = response.status;
      ctx.body = response;
    }
  };

function handleGenericError(err: Error): RFC7807Error {
  // Knex error where we are violating a unique constraint
  if (err.message.includes('duplicate key value violates unique constraint')) {
    return new DBConflictError(err);
  }

  return new InternalServerError(err);
}

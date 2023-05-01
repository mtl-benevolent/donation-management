import { appConfig } from '@/config';
import { ValidationError } from '@/system/errors/validation.error';
import { assertValid } from '@/system/validation/validate';
import Joi from 'joi';
import { Middleware } from 'koa';

export const validateBody = (schema: Joi.Schema): Middleware => {
  return async (ctx, next) => {
    const body = ctx.request.body;

    if (body == null) {
      throw new ValidationError('No body found in request', []);
    }

    assertValid(body, schema);

    await next();
  };
};

export const validateParam = (
  paramName: string,
  schema: Joi.Schema
): Middleware => {
  return async (ctx, next) => {
    const paramValue = ctx.params[paramName];

    if (paramValue == null) {
      throw new ValidationError(
        `Parameter ${paramName} could not be found`,
        []
      );
    }

    assertValid(paramValue, schema);

    await next();
  };
};

export const validateQuery = (
  queryName: string,
  schema: Joi.Schema,
  isMandatory = false
): Middleware => {
  return async (ctx, next) => {
    const queryValue = ctx.query[queryName];

    if (queryValue == null && isMandatory) {
      throw new ValidationError(
        `Query ${queryName} was not found, but is mandatory`,
        []
      );
    }

    assertValid(queryValue, schema);

    await next();
  };
};

export const validateResponse = (schema: Joi.Schema): Middleware => {
  return async (ctx, next) => {
    await next();

    if (ctx.response.body == null) {
      throw new ValidationError('No response body found', []);
    }

    try {
      assertValid(ctx.response.body, schema);
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        ctx.log.warn(err, 'Validation error on response');

        if (appConfig.koa.reportValidationErrors) {
          ctx.response.append('x-warnings', JSON.stringify(err.errors));
        }
      } else {
        throw err;
      }
    }
  };
};

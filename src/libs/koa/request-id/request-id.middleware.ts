import { Middleware } from 'koa';
import crypto from 'node:crypto';
import { contexts } from '../../../system/context/context';
import { regex } from '../../../utils/text/regex.utils';

export const requestId: Middleware = async (ctx, next) => {
  let maybeReqId = ctx.get('x-request-id');

  if (!maybeReqId || !regex.uuid.test(maybeReqId)) {
    maybeReqId = crypto.randomUUID();
  }

  ctx.req.id = maybeReqId;

  const wrappedNext = contexts.requestIdContext.withContext(maybeReqId, next);
  await wrappedNext();
};

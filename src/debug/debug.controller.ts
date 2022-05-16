import Router from '@koa/router';

export function createDebugRouter(): Router {
  const debugRouter = new Router({
    prefix: '/debug',
  });

  debugRouter.get('/', (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = 'OK';
  });

  return debugRouter;
}

import Router from '@koa/router';
import Koa from 'koa';
import koaLogsMiddleware from 'koa-pino-logger';
import { onShutdown } from 'node-graceful-shutdown';
import { AppConfig } from '../../config';
import { createDebugRouter } from '../../debug/debug.controller';
import { getLogger } from '../pino/bootstrap';

const logger = getLogger('koa');

let koaApp: Koa | undefined = undefined;

export function getKoa() {
  if (!koaApp) {
    throw new Error('Koa was not bootstrapped');
  }

  return koaApp;
}

function registerControllers(rootRouter: Router) {
  const routers = [createDebugRouter()];

  routers.forEach((router) => {
    rootRouter.use(router.routes(), router.allowedMethods());
  });
}

function initKoa() {
  const app = new Koa();
  const router = new Router();

  app.use(
    koaLogsMiddleware({
      logger,
      redact: [
        'req.remoteAddress',
        'req.remotePort',
        'req.headers["user-agent"]',
      ],
    })
  );

  // TODO: Add auth and other useful middlewares

  registerControllers(router);

  app.use(router.routes()).use(router.allowedMethods());

  return app;
}

export function bootstrapKoa(config: AppConfig['koa']) {
  if (koaApp) {
    return koaApp;
  }

  koaApp = initKoa();

  const server = koaApp.listen(config.port, () => {
    logger.info({}, 'Koa listening on port %d', config.port);
  });

  onShutdown('koa', () => {
    if (!server) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      server.close((maybeErr) => {
        if (maybeErr) {
          reject(maybeErr);
          return;
        }

        resolve();
      });
    });
  });

  return koaApp;
}

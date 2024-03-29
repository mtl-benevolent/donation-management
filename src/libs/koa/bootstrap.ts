import { appConfig } from '@/config';
import { createOrganizationController } from '@/organizations/controllers/organization.controller';
import Router from '@koa/router';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaLogsMiddleware from 'koa-pino-logger';
import { onShutdown } from 'node-graceful-shutdown';
import { getLogger } from '../pino/bootstrap';
import { errorHandler } from './errors/error-handler.middleware';
import { requestId } from './request-id/request-id.middleware';

const logger = getLogger('koa');

let koaApp: Koa | undefined = undefined;

const routers = [createOrganizationController()];

export function getKoa() {
  if (!koaApp) {
    throw new Error('Koa was not bootstrapped');
  }

  return koaApp;
}

function registerControllers(rootRouter: Router) {
  routers.forEach((router) => {
    rootRouter.use(router.routes(), router.allowedMethods());
  });
}

function initKoa() {
  const app = new Koa();
  const router = new Router();

  app.use(requestId);
  app.use(errorHandler(appConfig.koa));

  app.use(bodyParser());

  app.use(
    koaLogsMiddleware({
      logger: logger as any,
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

export function bootstrapKoa() {
  if (koaApp) {
    return koaApp;
  }

  const config = appConfig.koa;

  koaApp = initKoa();

  const server = koaApp.listen(config.port, () => {
    logger.info({}, 'Koa listening on port %d', config.port);
  });

  onShutdown('koa', () => {
    if (!server) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
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

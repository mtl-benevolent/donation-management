import { AppConfig, appConfig } from '@/config';
import { Knex, knex } from 'knex';
import { onShutdown } from 'node-graceful-shutdown';
import { LogFn } from 'pino';
import { getLogger } from '../pino/bootstrap';

const logger = getLogger('knex');

let knexInstance: Knex | undefined = undefined;

export function getKnex(): Knex {
  if (!knexInstance) {
    throw new Error('Knex is not initialized');
  }

  return knexInstance;
}

function makeLogger(severity: string) {
  return function knexLogger(message: any): void {
    ((logger as any)[severity] as LogFn)(message, 'Executed SQL Query');
  };
}

function initKnex(dbConfig: AppConfig['knex']) {
  const knexInstance = knex({
    client: 'pg',
    version: '13',
    connection: {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    },
    searchPath: [dbConfig.schema],
    debug: dbConfig.debug,
    asyncStackTraces: true,
    log: {
      debug: makeLogger('debug'),
      warn: () => {},
      error: makeLogger('error'),
    },
  });

  return knexInstance;
}

export function bootstrapKnex(): Knex {
  if (knexInstance) {
    return knexInstance;
  }

  knexInstance = initKnex(appConfig.knex);

  onShutdown('knex', ['koa'], async () => {
    await knexInstance?.destroy();
  });

  return knexInstance;
}

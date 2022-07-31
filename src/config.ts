import { safelyParseInteger } from './utils/number.utils';

export type AppConfig = typeof appConfig;

export const appConfig = {
  koa: {
    port: 8300,
  },
  knex: {
    host: process.env.DB_HOST || 'cockroachdb',
    port: safelyParseInteger(process.env.DB_PORT, 26257),
    user: process.env.DB_USER || 'donation_mgmt_app',
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME || 'donationsdb',
    schema: process.env.DB_SCHEMA || 'donations',
    debug: true,
  },
  encryption: {
    // Must be a Hexadecimal string of 32 bytes exactly
    secretValue: process.env.ENCRYPTION_KEY ?? '',
  },
};

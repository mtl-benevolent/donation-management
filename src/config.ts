import {
  AppEnvironment,
  appEnvironments,
} from './system/app-environments/app-environments.enum';
import { safelyParseEnum } from './utils/enums/enums.utils';
import { safelyParseInteger } from './utils/numbers/numbers.utils';

const appEnv = safelyParseEnum<AppEnvironment>(
  process.env.NODE_ENV,
  appEnvironments,
  appEnvironments.development
);

export type AppConfig = typeof appConfig;

export const appConfig = {
  environment: appEnv,
  koa: {
    port: 8300,
    safeErrors: process.env.SAFE_ERRORS === 'false' ? false : true,
    reportValidationErrors: [
      appEnvironments.development,
      appEnvironments.compose,
      appEnvironments.staging,
    ].includes(appEnv),
  },
  knex: {
    host: process.env.DB_HOST || 'roach1',
    port: safelyParseInteger(process.env.DB_PORT, 26257),
    user: process.env.DB_USER || 'donation_mgmt_app',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'donationsdb',
    schema: process.env.DB_SCHEMA || 'donations',
    debug: true,
  },
  encryption: {
    // Must be a Hexadecimal string of 32 bytes exactly
    secretValue: process.env.ENCRYPTION_KEY ?? '',
  },
};

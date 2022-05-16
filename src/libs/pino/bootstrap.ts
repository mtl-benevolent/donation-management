import pino, { Logger } from 'pino';

const logger = pino();

export function getLogger(component: string): Logger {
  return logger.child({ component });
}

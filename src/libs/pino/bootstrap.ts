import { onShutdownError } from 'node-graceful-shutdown';
import pino, { Logger } from 'pino';

const logger = pino();

export function getLogger(component: string): Logger {
  return logger.child({ component });
}

onShutdownError(async (err) => {
  logger.error(err, 'Error shutting down app');
});

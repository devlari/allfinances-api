import { AppServer } from './main/config/app-server';
import logger from '@tools/logger';

process.env.TZ = 'America/Sao_Paulo';
process.env.ORA_SDTZ = '-03:00';

enum ExitStatus {
  Failure = 1,
  Success = 0
}

(async (): Promise<void> => {
  try {
    const PORT = process.env.PORT ?? 3000;
    const HOST = process.env.API_HOST ?? '';

    const appServer = new AppServer();
    appServer.start(Number(PORT), HOST);
  } catch (error) {
    logger.error(`App exited with error: ${error}`);
    process.exit(ExitStatus.Failure);
  }
})();

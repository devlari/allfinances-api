import { Express, Router } from 'express';
import { pingRoutes } from '@/main/routes';
import { bankRoutes } from '@/main/api/modules/bank/routes';
import { Pool } from 'pg';

export default function setupRoutes(app: Express, pool: Pool) {
  const router = Router();
  app.use('/api', router);

  pingRoutes(router);
  bankRoutes(router, pool);
};

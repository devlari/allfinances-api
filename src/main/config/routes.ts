import { Express, Router } from 'express';
import { pingRoutes } from '@/main/routes';
import { bankRoutes } from '@/main/api/modules/bank/routes';
import { Pool } from 'pg';
import { authRoutes } from '../api/modules/auth/routes';

export default function setupRoutes(app: Express, pool: Pool) {
  const router = Router();
  app.use('/api', router);

  pingRoutes(router);
  authRoutes(router, pool);
  bankRoutes(router, pool);
};

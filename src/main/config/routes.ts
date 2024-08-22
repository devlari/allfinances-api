import { Express, Router } from 'express';
import { pingRoutes } from '@main/routes/index';

export default function setupRoutes(app: Express) {
  const router = Router();
  app.use('/api', router);

  pingRoutes(router);
};

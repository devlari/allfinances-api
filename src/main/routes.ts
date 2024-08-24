import { Router, Request, Response } from 'express';

export function pingRoutes(
  router: Router
): void {
  router.get('/ping', (req: Request, res: Response) => {
    res.send('pong');
  });
}

import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { BankController } from './controller';
import { BankDAO } from './dao';
import { BankService } from './service';

export function bankRoutes(
  router: Router,
  connectionPool: Pool
): void {
  const dao = new BankDAO(connectionPool);
  const service = new BankService(dao);
  const controller = new BankController(service);

  router.post(
    '/bank',
    async (req: Request, res: Response) => {

      const HttpResponse = await controller.newBank(
        req.body
      );

      return res.status(HttpResponse.statusCode).json(HttpResponse.body);
    }
  );

  router.get('/banks/user/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const HttpResponse = await controller.getFromUser(Number(userId));

    return res.status(HttpResponse.statusCode).json(HttpResponse.body);
  });

  router.get('/banks/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    const HttpResponse = await controller.getFromId(
      Number(id)
    );

    return res.status(HttpResponse.statusCode).json(HttpResponse.body);
  });

  router.put(
    '/banks/:id',
    async (req: Request, res: Response) => {

      const HttpResponse = await controller.editBank(
        Number(req.params.id),
        req.body
      );

      return res.status(HttpResponse.statusCode).json(HttpResponse.body);
    }
  );

  router.delete('/banks/:id', async (req: Request, res: Response) => {
    const HttpResponse = await controller.deleteBank(Number(req.params.id));

    return res.status(HttpResponse.statusCode).json(HttpResponse.body);
  });
}

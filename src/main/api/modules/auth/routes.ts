import { Router, Request, Response } from "express";
import { Pool } from "pg";
import { AuthController } from "./controller";
import { AuthService } from "./service";
import { AuthDAO } from "./dao";

export function authRoutes(
    router: Router,
    connectionPool: Pool
): void {
    const dao = new AuthDAO(connectionPool);
    const service = new AuthService(dao);
    const controller = new AuthController(service);

    router.post('/register', async (req: Request, res: Response) => {
        const HttpResponse = await controller.register(req.body);
        return res.status(HttpResponse.statusCode).json(HttpResponse.body);
    });

    router.post('/login', async (req: Request, res: Response) => {
        const HttpResponse = await controller.login(req.body);
        return res.status(HttpResponse.statusCode).json(HttpResponse.body);
    });

    router.post('/me', async (req: Request, res: Response) => {
        const HttpResponse = await controller.me(req.headers.userId);
        return res.status(HttpResponse.statusCode).json(HttpResponse.body);
    });

    router.post('/refresh-token', async (req: Request, res: Response) => {
        const token = req.body.token || '';

        const httpResponse = await controller.refreshToken(token);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    });
}
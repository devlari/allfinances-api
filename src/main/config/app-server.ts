import express, { Express } from 'express';
import helmet from 'helmet';
import setupRoutes from './routes';
import logger from '@tools/logger';
import cors from 'cors';
import { Pool } from 'pg';

export class AppServer {
  public app: Express;
  public connectionPool?: Pool;

  constructor() {
    this.app = express();
  }

  async connect(): Promise<void> {
    this.connectionPool = new Pool({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: Number(process.env.DB_PORT),
      max: 10
    })
  }

  start(port: number, host = ''): void {
    this.middlewares();
    this.routes();

    if (host != '') {
      this.app.listen(port, host, () =>
        logger.info(`Running on ${host}:${port}`)
      );
    } else {
      this.app.listen(port, () => logger.info(`Running on port ${port}`));
    }
  }

  stop(): void {
    logger.info('Parando');
  }

  private middlewares(): void {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private routes(): void {

    if (!this.connectionPool) {
      return;
    }

    setupRoutes(this.app, this.connectionPool);
  }
}

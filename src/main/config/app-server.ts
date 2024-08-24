import express, { Express } from 'express';
import helmet from 'helmet';
import setupRoutes from './routes';
import logger from '@/tools/logger';
import cors from 'cors';
import { Pool } from 'pg';

export class AppServer {
  public app: Express;
  public connectionPool?: Pool;

  constructor() {
    this.app = express();
  }

  async connect(): Promise<void> {
    try {
      this.connectionPool = new Pool({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: Number(process.env.DB_PORT),
        max: 10
      })
      console.log('Conexão com o banco estabelecida');
    } catch (error) {
      console.log(error);
    }
  }

  async testConnection() {
    try {

      if (!this.connectionPool) {
        console.log('não há pool de conexão')
        return;
      };

      const client = await this.connectionPool.connect();
      console.log('Conexão com o banco de dados bem-sucedida!');
      const result = await client.query('SELECT NOW()');
      console.log('Data e hora atual do banco de dados:', result.rows[0]);
      client.release();
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    }
  };

  async start(port: number, host = ''): Promise<void> {
    await this.connect();

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
      console.log('sem conexão');
      return;
    }

    setupRoutes(this.app, this.connectionPool);
  }
}

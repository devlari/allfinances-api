import { Pool, PoolClient, QueryResultRow } from 'pg';

export abstract class DAO {
  public connection: PoolClient | null = null;

  constructor(public readonly connectionPool: Pool) { }

  async openConnection(): Promise<PoolClient> {
    if (!this.connection) {
      this.connection = await this.connectionPool.connect();
    }

    return this.connection;
  }

  async closeConnection(): Promise<void> {
    if (!this.connection) return;

    try {
      await this.connection.release();
    } catch (error) {
      /* empty */
    }

    this.connection = null;
  }

  async commit(close = true): Promise<void> {
    if (!this.connection) return;

    await this.connection.query('COMMIT');

    if (close) {
      await this.closeConnection();
    }
  }

  async rollback(): Promise<void> {
    if (!this.connection) return;

    await this.connection.query('ROLLBACK');
  }

  async execSQL(sql: string, params: unknown[], commit = true): Promise<void> {
    if (!this.connection) {
      throw new Error('Não há conexão aberta com o banco de dados');
    }

    await this.connection.query(sql, params);

    if (commit) {
      await this.commit(false);
    }
  }

  async execPostSQL(sql: string, params: unknown[], commit = true): Promise<number> {
    if (!this.connection) {
      throw new Error('Não há conexão aberta com o banco de dados');
    }

    const result = await this.connection.query(sql, params);

    if (commit) {
      await this.commit(false);
    }

    return result.rows[0].id;
  }

  async query<T extends QueryResultRow>(sql: string, params: unknown[]): Promise<T[]> {
    if (!this.connection) {
      throw new Error('Não há conexão aberta com o banco de dados');
    }

    const result = await this.connection.query<T>(sql, params);

    return result.rows;
  }

  async queryOne<T extends QueryResultRow>(sql: string, params: unknown[]): Promise<T | null> {
    const result = await this.query<T>(sql, params);

    if (!result || result.length === 0) {
      return null;
    }

    return result[0];
  }
}

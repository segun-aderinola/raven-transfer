import knex, { Knex } from 'knex';
import {configs} from './knexfile';

class Database {
  private environment: string;
  private db: Knex;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.db = knex(String(configs[this.environment]));
  }

  public getConnection(): Knex {
    return this.db;
  }

  public async testConnection(): Promise<boolean> {
    try {
      await this.db.raw('SELECT 1');
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  public async closeConnection(): Promise<void> {
    await this.db.destroy();
  }
}

export default new Database();
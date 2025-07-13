import knex, { Knex } from 'knex';
import { configs } from './knexfile';

class Database {
  private environment: string;
  private db: Knex;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    const config = configs[this.environment] || configs.development;
    this.db = knex(config!);
  }

  public getConnection(): Knex {
    return this.db;
  }

  public async testConnection(): Promise<any> {
    try {
      await this.db.raw('SELECT 1');
      console.log('Database connection successful');
      return true;
    } catch (error: any) {
      if (error.code === 'ER_BAD_DB_ERROR') {
        console.log('Database does not exist, creating it...');
        await this.createDatabase();
        const config = this.getValidConfig();
        this.db = knex(config);
        await this.testConnection();
      } else {
        throw error;
      }
    }
  }

  public async closeConnection(): Promise<void> {
    await this.db.destroy();
  }

  private async createDatabase() {
    const config = this.getValidConfig();
    const { database, ...connectionWithoutDb } = config.connection as any;
    const tempDb = knex({
      ...config,
      connection: connectionWithoutDb
    });
    
    try {
      await tempDb.raw(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
      console.log(`Database '${database}' created successfully`);
    } finally {
      await tempDb.destroy();
    }
  }

  private getValidConfig(): any {
    const config = configs[this.environment];
    
    if (!config) {
      console.warn(`Config for ${this.environment} not found, falling back to development`);
      return configs.development;
    }
    
    return config;
  }


}

export default new Database();
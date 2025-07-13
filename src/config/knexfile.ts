import path from 'path';
import dotenv from 'dotenv';
import { DatabaseConfig } from '@/types';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const configs: Record<string, DatabaseConfig> = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'raven_pay',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds'),
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT!),
      database: process.env.DB_NAME!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
    },
    migrations: {
      directory: path.join(__dirname, '../database/migrations'),
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
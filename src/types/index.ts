export interface DatabaseConfig {
    client: string;
    connection: {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
    };
    migrations?: {
      directory: string;
    };
    seeds?: {
      directory: string;
    };
    pool?: {
      min: number;
      max: number;
    };
  }


  export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string | null;
    timestamp: string;
  }
  
  export interface JwtPayload {
    id: number;
    email: string;
    iat?: number;
    exp?: number;
  }
  
  export interface PaginationOptions {
    limit?: number;
    offset?: number;
  }
  
  export type TransactionType = 'deposit' | 'transfer' | 'withdrawal';
  export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed';
  export type UserStatus = 'active' | 'inactive' | 'suspended';
  export type AccountStatus = 'active' | 'inactive' | 'suspended';
  export type WebhookStatus = 'received' | 'processed' | 'failed';

  import './express';
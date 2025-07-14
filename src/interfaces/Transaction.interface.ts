import { TransactionType, TransactionStatus } from '@/types';

export interface ITransaction {
  id: number;
  user_id: number;
  reference: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description?: string;
  recipient_account?: string;
  recipient_bank?: string;
  recipient_bank_code?: string;
  raven_transaction_id?: string;
  // metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateTransaction {
  user_id: number;
  reference: string;
  type: TransactionType;
  amount: number;
  description?: string;
  recipient_account?: string;
  recipient_bank?: string;
  recipient_bank_code?: string;
  status?: TransactionStatus;
}
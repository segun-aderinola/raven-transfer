import { AccountStatus } from '@/types';

export interface IBankAccount {
  id: number;
  user_id: number;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
  raven_account_id?: string;
  status: AccountStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateBankAccount {
  user_id: number;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
  raven_account_id?: string;
}
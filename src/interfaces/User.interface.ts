import { UserStatus } from '@/types';

export interface IUser {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  balance: number;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateUser {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}
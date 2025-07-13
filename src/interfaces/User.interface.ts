import { UserStatus } from '@/types';

export interface IUser {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  bvn: string;
  nin: string;
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
  bvn: string;
  nin: string;
}

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}
import { BaseModel } from './BaseModel';
import { IBankAccount } from '@/interfaces/BankAccount.interface';

export class BankAccount extends BaseModel<IBankAccount> {
  constructor() {
    super('bank_accounts');
  }

  public async findByUserId(userId: number): Promise<IBankAccount[]> {
    return await this.findBy({ user_id: userId } as Partial<IBankAccount>);
  }

  public async findByAccountNumber(accountNumber: string): Promise<IBankAccount | undefined> {
    return await this.findOneBy({ account_number: accountNumber } as Partial<IBankAccount>);
  }
}
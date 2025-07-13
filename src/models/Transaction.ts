import { BaseModel } from './BaseModel';
import { ITransaction } from '@/interfaces/Transaction.interface';
import { TransactionType } from '@/types';

export class Transaction extends BaseModel<ITransaction> {
  constructor() {
    super('transactions');
  }

  public async findByUserId(userId: number): Promise<ITransaction[]> {
    return await this.findBy({ user_id: userId } as Partial<ITransaction>);
  }

  public async findByReference(reference: string): Promise<ITransaction | undefined> {
    return await this.findOneBy({ reference } as Partial<ITransaction>);
  }

  public async findByType(userId: number, type: TransactionType): Promise<ITransaction[]> {
    return await this.findBy({ user_id: userId, type } as Partial<ITransaction>);
  }

  public async getUserTransactionHistory(
    userId: number, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<ITransaction[]> {
    return await this.db(this.tableName)
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }
}
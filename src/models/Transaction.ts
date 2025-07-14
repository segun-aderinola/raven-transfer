import { BaseModel } from './BaseModel';
import { ICreateTransaction, ITransaction } from '@/interfaces/Transaction.interface';
import { TransactionType } from '@/types';
import { Knex } from 'knex';

export class Transaction extends BaseModel<ITransaction> {
  constructor() {
    super('transactions');
  }

  public async findByUserId(userId: number): Promise<ITransaction[]> {
    return await this.findBy({ user_id: userId } as Partial<ITransaction>);
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

  public async findByIdempotencyKey(idempotencyKey: string, trx?: Knex.Transaction): Promise<ITransaction | null> {
    const result = await this.findOneBy({ reference: idempotencyKey } as Partial<ITransaction>, trx);
    return result ?? null;
  }

  public override async create(data: ICreateTransaction, trx?: Knex.Transaction): Promise<ITransaction> {
    return await super.create(data, trx);
  }
}
import { Knex } from 'knex';
import { BaseModel } from './BaseModel';
import { IWalletAccount } from '@/interfaces/WalletAccount.interface';

export class Wallet extends BaseModel<IWalletAccount> {
  constructor() {
    super('wallets');
  }

  public async findByUserId(userId: number, trx: Knex.Transaction): Promise<IWalletAccount> {
    return await trx(this.tableName)
      .where('user_id', userId)
      .first();
  }

  public async findByAccountNumber(account_number: string): Promise<IWalletAccount> {
    return await this.db(this.tableName)
      .where('account_number', account_number)
      .first();
  }
  // Lock wallet row for update (prevents concurrent modifications)
  public async findByUserIdForUpdate(userId: number, trx: Knex.Transaction): Promise<IWalletAccount | null> {
    return await trx(this.tableName)
      .where('user_id', userId)
      .forUpdate()
      .first();
  }

  public async addBalance(userId: number, amount: number, trx: Knex.Transaction): Promise<void> {
    const result = await trx.raw(`
      UPDATE ${this.tableName} 
      SET balance = balance + ?,
          updated_at = NOW()
      WHERE user_id = ?
    `, [amount, userId]);

    if (result.affectedRows === 0) {
      throw new Error('Failed to add balance - user not found');
    }
  }

  public async deductBalance(userId: number, amount: number, trx: Knex.Transaction): Promise<void> {
    const result = await trx.raw(`
      UPDATE ${this.tableName} 
      SET balance = balance - ?,
          updated_at = NOW()
      WHERE user_id = ? 
        AND balance >= ?
    `, [amount, userId, amount]);

    if (result.affectedRows === 0) {
      throw new Error('Failed to deduct balance - insufficient funds');
    }
  }
}
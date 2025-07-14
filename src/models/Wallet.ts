import { Knex } from 'knex';
import { BaseModel } from './BaseModel';
import { IWalletAccount } from '@/interfaces/WalletAccount.interface';

export class Wallet extends BaseModel<IWalletAccount> {
  constructor() {
    super('wallet_accounts');
  }

  public async findByUserId(userId: number, trx: Knex.Transaction): Promise<IWalletAccount> {
    return await trx(this.tableName)
      .where('user_id', userId)
      .forUpdate()
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

  // Lock amount with validation
  public async lockAmount(userId: number, amount: number, trx: Knex.Transaction): Promise<void> {
    // First, get current wallet state with row lock
    const wallet = await this.findByUserIdForUpdate(userId, trx);
    
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const currentLockedAmount = wallet.locked_amount || 0;
    const availableBalance = wallet.balance - currentLockedAmount;

    if (availableBalance < amount) {
      throw new Error(`Insufficient balance. Available: ${availableBalance}, Required: ${amount}`);
    }

    // Use raw SQL for atomic update with validation
    const result = await trx.raw(`
      UPDATE ${this.tableName} 
      SET locked_amount = locked_amount + ?, 
          updated_at = NOW()
      WHERE user_id = ? 
        AND (balance - locked_amount) >= ?
        AND locked_amount + ? <= balance
    `, [amount, userId, amount, amount]);

    if (result.affectedRows === 0) {
      throw new Error('Failed to lock amount - insufficient balance or concurrent modification');
    }
  }

  // Unlock amount with validation
  public async unlockAmount(userId: number, amount: number, trx: Knex.Transaction): Promise<void> {
    const result = await trx.raw(`
      UPDATE ${this.tableName} 
      SET locked_amount = GREATEST(0, locked_amount - ?),
          updated_at = NOW()
      WHERE user_id = ? 
        AND locked_amount >= ?
    `, [amount, userId, amount]);

    if (result.affectedRows === 0) {
      throw new Error('Failed to unlock amount - insufficient locked amount');
    }
  }

  // Atomic deduct and unlock
  public async deductAndUnlockAmount(userId: number, amount: number, trx: Knex.Transaction): Promise<void> {
    const result = await trx.raw(`
      UPDATE ${this.tableName} 
      SET balance = balance - ?,
          locked_amount = locked_amount - ?,
          updated_at = NOW()
      WHERE user_id = ? 
        AND balance >= ?
        AND locked_amount >= ?
    `, [amount, amount, userId, amount, amount]);

    if (result.affectedRows === 0) {
      throw new Error('Failed to deduct and unlock - insufficient balance or locked amount');
    }
  }

  // Alternative: Single atomic operation for complete transfer
  public async atomicTransferDeduction(
    userId: number, 
    amount: number, 
    trx: Knex.Transaction
  ): Promise<IWalletAccount> {
    // Lock, validate, deduct, and unlock in one operation
    const result = await trx.raw(`
      UPDATE ${this.tableName} 
      SET balance = balance - ?,
          locked_amount = locked_amount - ?,
          updated_at = NOW()
      WHERE user_id = ? 
        AND balance >= ?
        AND locked_amount >= ?
    `, [amount, amount, userId, amount, amount]);

    if (result.affectedRows === 0) {
      throw new Error('Atomic transfer failed - insufficient balance or locked amount');
    }

    // Return updated wallet
    return await this.findByUserId(userId, trx);
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
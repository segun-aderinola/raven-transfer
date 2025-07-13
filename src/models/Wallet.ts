import { BaseModel } from './BaseModel';
import { IWalletAccount } from '@/interfaces/WalletAccount.interface';

export class Wallet extends BaseModel<IWalletAccount> {
  constructor() {
    super('wallets');
  }

  public async findByUserId(userId: number): Promise<IWalletAccount> {
    const wallets = await this.findOneBy({ user_id: userId })
    return wallets as IWalletAccount;
  }

  public async findByAccountNumber(accountNumber: string): Promise<IWalletAccount | undefined> {
    return await this.findOneBy({ account_number: accountNumber } as Partial<IWalletAccount>);
  }

  public async updateBalance(userId: number, amount: number): Promise<void> {
    await this.db(this.tableName)
      .where({ user_id: userId })
      .increment('balance', amount);
  }
}
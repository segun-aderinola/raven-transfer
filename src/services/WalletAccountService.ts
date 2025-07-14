import { Wallet } from '@/models/Wallet';
import { RavenService } from './RavenService';
import { IWalletAccount, ICreateWalletAccount } from '@/interfaces/WalletAccount.interface';
import { IUserWithoutPassword } from '@/interfaces/User.interface';
import { Knex } from 'knex';

export class BankAccountService {
  private walletModel: Wallet;
  private ravenService: RavenService;

  constructor() {
    this.walletModel = new Wallet();
    this.ravenService = new RavenService();
  }

  public async createVirtualAccount(user: IUserWithoutPassword, trx?: Knex.Transaction): Promise<IWalletAccount> {
    try {
      const ravenAccount = await this.ravenService.createVirtualAccount({
        first_name: user.first_name,
        last_name: user.last_name,
        bvn: user.bvn,
        nin: user.nin,
        email: user.email,
        phone: user.phone
      });

      const walletAccountData: ICreateWalletAccount = {
        user_id: user.id,
        account_number: ravenAccount.account_number,
        account_name: ravenAccount.account_name,
        bank_name: ravenAccount.bank_name,
        bank_code: ravenAccount.bank_code,
        raven_account_id: ravenAccount.id
      };

      const bankAccount = await this.walletModel.create(walletAccountData, trx);
      return bankAccount;
    } catch (error: any) {
      throw new Error(`Failed to create virtual account: ${error.message}`);
    }
  }

  public async getBankAccount(accountNumber: string): Promise<IWalletAccount | undefined> {
    return await this.walletModel.findByAccountNumber(accountNumber);
  }
}
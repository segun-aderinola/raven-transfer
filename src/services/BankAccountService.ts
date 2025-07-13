import { BankAccount } from '@/models/BankAccount';
import { RavenService } from './RavenService';
import { IBankAccount, ICreateBankAccount } from '@/interfaces/BankAccount.interface';
import { IUserWithoutPassword } from '@/interfaces/User.interface';

export class BankAccountService {
  private bankAccountModel: BankAccount;
  private ravenService: RavenService;

  constructor() {
    this.bankAccountModel = new BankAccount();
    this.ravenService = new RavenService();
  }

  public async createVirtualAccount(user: IUserWithoutPassword): Promise<IBankAccount> {
    try {
      const ravenAccount = await this.ravenService.createVirtualAccount({
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone
      });

      const bankAccountData: ICreateBankAccount = {
        user_id: user.id,
        account_number: ravenAccount.account_number,
        account_name: ravenAccount.account_name,
        bank_name: ravenAccount.bank_name,
        bank_code: ravenAccount.bank_code,
        raven_account_id: ravenAccount.id
      };

      const bankAccount = await this.bankAccountModel.create(bankAccountData);
      return bankAccount;
    } catch (error: any) {
      throw new Error(`Failed to create virtual account: ${error.message}`);
    }
  }

  public async getUserBankAccounts(userId: number): Promise<IBankAccount[]> {
    return await this.bankAccountModel.findByUserId(userId);
  }

  public async getBankAccount(accountNumber: string): Promise<IBankAccount | undefined> {
    return await this.bankAccountModel.findByAccountNumber(accountNumber);
  }
}
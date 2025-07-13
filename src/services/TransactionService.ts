import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '@/models/Transaction';
import { User } from '@/models/User';
import { RavenService } from './RavenService';
import { TransferDto, DepositDto } from '@/dto/TransactionDto';
import { ITransaction, ICreateTransaction } from '@/interfaces/Transaction.interface';
import { TransactionType } from '@/types';
import { Wallet } from '@/models/Wallet';

export class TransactionService {
  public transactionModel: Transaction;
  public walletModel: Wallet;
  private ravenService: RavenService;

  constructor() {
    this.transactionModel = new Transaction();
    this.walletModel = new Wallet();
    this.ravenService = new RavenService();
  }

  public async initiateTransfer(userId: number, transferData: any): Promise<ITransaction> {
    const transferDto = new TransferDto(transferData);
    
    // Check user balance
    const wallet = await this.walletModel.findByUserId(userId);
    if (!wallet || wallet.balance < transferDto.amount) {
      throw new Error('Insufficient balance');
    }

    // Verify recipient account
    const verification = await this.ravenService.verifyAccount(
      transferDto.recipient_account,
      transferDto.recipient_bank
    );

    if (!verification.valid) {
      throw new Error('Invalid recipient account');
    }

    // Create transaction record
    const reference = uuidv4();
    const transactionData: ICreateTransaction = {
      user_id: userId,
      reference,
      type: 'transfer',
      amount: transferDto.amount,
      currency: transferDto.currency,
      description: transferDto.description,
      recipient_account: transferDto.recipient_account,
      recipient_bank: transferDto.recipient_bank,
      status: 'pending'
    };

    const transaction = await this.transactionModel.create(transactionData);

    // Initiate transfer via Raven
    try {
      const ravenTransfer = await this.ravenService.initiateTransfer({
        amount: transferDto.amount,
        currency: transferDto.currency,
        recipient_account: transferDto.recipient_account,
        recipient_bank: transferDto.recipient_bank,
        reference,
        description: transferDto.description
      });

      // Update transaction with Raven ID
      await this.transactionModel.update(transaction.id, {
        raven_transaction_id: ravenTransfer.id,
        status: 'processing'
      });

      // Deduct from user balance
      await this.walletModel.updateBalance(userId, -transferDto.amount);

      return await this.transactionModel.findById(transaction.id) as ITransaction;
    } catch (error: any) {
      // Mark transaction as failed
      await this.transactionModel.update(transaction.id, {
        status: 'failed',
        metadata: { error: error.message }
      });
      throw error;
    }
  }

  public async getUserTransactions(userId: number, limit: number = 50, offset: number = 0): Promise<ITransaction[]> {
    return await this.transactionModel.getUserTransactionHistory(userId, limit, offset);
  }

  public async getTransactionsByType(userId: number, type: TransactionType): Promise<ITransaction[]> {
    return await this.transactionModel.findByType(userId, type);
  }

  public async getTransactionByReference(reference: string): Promise<ITransaction | undefined> {
    return await this.transactionModel.findByReference(reference);
  }

  public async processWebhookDeposit(webhookData: any): Promise<ITransaction> {
    // Process deposit webhook from Raven
    const { reference, amount, status, account_number } = webhookData;

    // Find user by account number
    const { BankAccountService } = await import('./WalletAccountService');
    const bankAccountService = new BankAccountService();
    const bankAccount = await bankAccountService.getBankAccount(account_number);

    if (!bankAccount) {
      throw new Error('Bank account not found');
    }

    // Create deposit transaction
    const transactionData: ICreateTransaction = {
      user_id: bankAccount.user_id,
      reference,
      type: 'deposit',
      amount,
      currency: 'NGN',
      status: status === 'successful' ? 'completed' : 'failed',
      description: 'Bank transfer deposit'
    };

    const transaction = await this.transactionModel.create(transactionData);

    // Update user balance if successful
    if (status === 'successful') {
      await this.walletModel.updateBalance(bankAccount.user_id, amount);
    }

    return transaction;
  }
}
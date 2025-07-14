import crypto from "crypto"
import { Transaction } from '@/models/Transaction';
import { RavenService } from './RavenService';
import { TransferDto, DepositDto } from '@/dto/TransactionDto';
import { ITransaction, ICreateTransaction } from '@/interfaces/Transaction.interface';
import { TransactionType } from '@/types';
import { Wallet } from '@/models/Wallet';
import database from '@/config/database';
import logger from '@/config/logger';

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
    const db = database.getConnection();
    
    const idempotencyKey = crypto.randomUUID() + '_' + Date.now();
    
    // Check if transfer with this idempotency key already exists
    const existingTransfer = await this.transactionModel.findByIdempotencyKey(idempotencyKey);
    if (existingTransfer) {
      return existingTransfer;
    }
  
    return await db.transaction(async (trx) => {
      try {
        // Lock wallet row for update to prevent concurrent modifications
        const wallet = await this.walletModel.findByUserIdForUpdate(userId, trx);
        if (!wallet) {
          throw new Error('Wallet not found');
        }
  
        const verification = await this.ravenService.verifyAccount(
          transferDto.account_number,
          transferDto.bank_code
        );
  
        if (!verification.valid) {
          throw new Error('Invalid recipient account');
        }
        
        const transactionData: ICreateTransaction = {
          user_id: userId,
          reference: idempotencyKey,
          type: 'transfer',
          amount: transferDto.amount,
          description: "Transfer",
          recipient_account: transferDto.account_number,
          recipient_bank: transferDto.bank_code,
        };
  
        const transaction = await this.transactionModel.create(transactionData, trx);
  
        // Initiate transfer via Raven
        try {
          const ravenTransfer = await this.ravenService.initiateTransfer({
            amount: transferDto.amount,
            currency: "NGN",
            account_number: transferDto.account_number,
            bank: transferDto.bank,
            bank_code: transferDto.bank_code,
            account_name: transferDto.account_name,
            reference: idempotencyKey,
            description: `Transfer to ${transferDto.account_name}`,
          });
  
          // Update transaction with Raven ID and set to processing
          await this.transactionModel.update(transaction.id, {
            raven_transaction_id: ravenTransfer.id,
            status: 'processing'
          }, trx);
  
          return await this.transactionModel.findById(transaction.id, trx) as ITransaction;
  
        } catch (ravenError: any) {
          // If Raven API fails, unlock the amount and mark transaction as failed
          await this.walletModel.unlockAmount(userId, transferDto.amount, trx);
          
          await this.transactionModel.update(transaction.id, {
            status: 'failed',
            metadata: { error: ravenError.message }
          }, trx);
  
          throw new Error(`Transfer failed: ${ravenError.message}`);
        }
  
      } catch (error: any) {
        throw error;
      }
    });
  }
  
  public async getUserTransactions(userId: number, limit: number = 50, offset: number = 0): Promise<ITransaction[]> {
    return await this.transactionModel.getUserTransactionHistory(userId, limit, offset);
  }

  public async getTransactionsByType(userId: number, type: TransactionType): Promise<ITransaction[]> {
    return await this.transactionModel.findByType(userId, type);
  }

  public async getTransactionByReference(reference: string): Promise<ITransaction | null> {
    return await this.transactionModel.findByIdempotencyKey(reference);
  }
  public async processWebhookDeposit(webhookData: any): Promise<ITransaction> {
    const { reference, amount, status, account_number } = webhookData;
    const db = database.getConnection();
  
    return await db.transaction(async (trx) => {
      try {
        // Find user by account number
        const { BankAccountService } = await import('./WalletAccountService');
        const bankAccountService = new BankAccountService();
        const bankAccount = await bankAccountService.getBankAccount(account_number);
  
        if (!bankAccount) {
          throw new Error('Bank account not found');
        }
  
        // Check for duplicate processing (idempotency)
        const existingTransaction = await this.transactionModel.findByIdempotencyKey(reference, trx);
        if (existingTransaction) {
          logger.error(`Deposit webhook already processed for reference: ${reference}`);
          return existingTransaction;
        }
  
        // Create deposit transaction
        const transactionData: ICreateTransaction = {
          user_id: bankAccount.user_id,
          reference,
          type: 'deposit',
          amount,
          status: status === 'successful' ? 'completed' : 'failed',
          description: 'Bank transfer deposit',
        };
  
        const transaction = await this.transactionModel.create(transactionData, trx);
  
        // ✅ ADD balance for successful deposits (not deduct!)
        if (status === 'successful') {
          await this.walletModel.addBalance(bankAccount.user_id, amount, trx);
          
          console.log(`✅ Deposit processed: $${amount} added to user ${bankAccount.user_id}`);
        } else {
          console.log(`❌ Deposit failed for user ${bankAccount.user_id}: ${webhookData.error || 'Unknown error'}`);
        }
  
        return transaction;
      } catch (error) {
        console.error('Error processing deposit webhook:', error);
        throw error;
      }
    });
  }
}
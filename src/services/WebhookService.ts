import { Webhook } from '@/models/Webhook';
import { TransactionService } from './TransactionService';
import { IWebhook, ICreateWebhook } from '@/interfaces/Webhook.interface';
import database from '@/config/database';

export class WebhookService {
  private webhookModel: Webhook;
  private transactionService: TransactionService;

  constructor() {
    this.webhookModel = new Webhook();
    this.transactionService = new TransactionService();
  }

  public async processWebhook(payload: any): Promise<IWebhook> {
    const { event, data } = payload;
    
    // Store webhook
    const webhookData: ICreateWebhook = {
      event_type: event,
      reference: payload.reference,
      payload: payload
    };

    const webhook = await this.webhookModel.create(webhookData);

    try {
      switch (event) {
        case 'transfer.successful':
          await this.handleTransferSuccess(data);
          break;
        case 'transfer.failed':
          await this.handleTransferFailed(data);
          break;
        case 'deposit.successful':
          await this.handleDepositSuccess(data);
          break;
        default:
          console.log(`Unhandled webhook event: ${event}`);
      }

      await this.webhookModel.markAsProcessed(webhook.id);
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      await this.webhookModel.update(webhook.id, {
        status: 'failed',
        // payload: { error: error.message }
      });
    }

    return webhook;
  }

  private async handleTransferSuccess(data: any): Promise<void> {
    const transaction = await this.transactionService.getTransactionByReference(data.reference);
    if (transaction) {
      await this.transactionService.transactionModel.update(transaction.id, {
        status: 'completed'
      });
    }
  }

  private async handleTransferFailed(data: any): Promise<void> {
    const transaction = await this.transactionService.getTransactionByReference(data.reference);
    if (transaction) {
      await this.transactionService.transactionModel.update(transaction.id, {
        status: 'failed'
      });
      const db = database.getConnection();
      const trx = await db.transaction();
      // Refund user balance
      await this.transactionService.walletModel.addBalance(transaction.user_id, transaction.amount, trx);
    }
  }

  private async handleDepositSuccess(data: any): Promise<void> {
    await this.transactionService.processWebhookDeposit(data);
  }
}
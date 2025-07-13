import { BaseModel } from './BaseModel';
import { IWebhook } from '@/interfaces/Webhook.interface';

export class Webhook extends BaseModel<IWebhook> {
  constructor() {
    super('webhooks');
  }

  public async findByReference(reference: string): Promise<IWebhook | undefined> {
    return await this.findOneBy({ reference } as Partial<IWebhook>);
  }

  public async markAsProcessed(id: number): Promise<IWebhook> {
    return await this.update(id, {
      status: 'processed',
      processed_at: new Date()
    } as Partial<IWebhook>);
  }
}
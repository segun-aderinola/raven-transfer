import { Request, Response } from 'express';
import { WebhookService } from '@/services/WebhookService';
import { ResponseDto } from '@/dto/ResponseDto';

export class WebhookController {
  private webhookService: WebhookService;

  constructor() {
    this.webhookService = new WebhookService();
  }

  public async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      console.log('Webhook received:', payload);
      
      await this.webhookService.processWebhook(payload);
      
      res.status(200).json(ResponseDto.success('Webhook processed successfully'));
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      res.status(500).json(ResponseDto.error('Webhook processing failed'));
    }
  }
}
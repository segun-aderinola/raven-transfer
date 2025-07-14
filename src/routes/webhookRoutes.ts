import { Router } from 'express';
import { WebhookController } from '@/controllers/WebhookController';

export class WebhookRoutes {
  private router: Router;
  private webhookController: WebhookController;

  constructor() {
    this.router = Router();
    this.webhookController = new WebhookController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      this.webhookController.handleWebhook.bind(this.webhookController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
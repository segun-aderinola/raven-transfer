import { Router, Request, Response } from 'express';
import { AuthRoutes } from './authRoutes';
import { BankAccountRoutes } from './bankAccountRoutes';
import { TransactionRoutes } from './transactionRoutes';
import { WebhookRoutes } from './webhookRoutes';

export class Routes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Authentication routes
    const authRoutes = new AuthRoutes();
    this.router.use('/auth', authRoutes.getRouter());

    // Bank account routes
    const bankAccountRoutes = new BankAccountRoutes();
    this.router.use('/bank-accounts', bankAccountRoutes.getRouter());

    // Transaction routes
    const transactionRoutes = new TransactionRoutes();
    this.router.use('/transactions', transactionRoutes.getRouter());

    // Webhook routes
    const webhookRoutes = new WebhookRoutes();
    this.router.use('/webhook', webhookRoutes.getRouter());

    // Health check
    this.router.get('/health', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
      });
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}

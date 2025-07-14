import { Router, Request, Response } from 'express';
import { AuthRoutes } from './authRoutes';
import { TransactionRoutes } from './transactionRoutes';
import { WebhookRoutes } from './webhookRoutes';

export class Routes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const authRoutes = new AuthRoutes();
    this.router.use('/auth', authRoutes.getRouter());

    const transactionRoutes = new TransactionRoutes();
    this.router.use('/transactions', transactionRoutes.getRouter());

    const webhookRoutes = new WebhookRoutes();
    this.router.use('/webhook', webhookRoutes.getRouter());

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

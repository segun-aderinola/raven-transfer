import { Router } from 'express';
import { TransactionController } from '@/controllers/TransactionController';
import { TransactionValidator } from '@/validators/TransactionValidator';
import { ValidationMiddleware } from '@/middleware/ValidationMiddleware';
import { AuthMiddleware } from '@/middleware/AuthMiddleware';

export class TransactionRoutes {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // POST /api/transactions/transfer
    this.router.post(
      '/transfer',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(TransactionValidator.validateTransfer),
      this.transactionController.initiateTransfer.bind(this.transactionController)
    );

    // GET /api/transactions/history
    this.router.get(
      '/history',
      AuthMiddleware.authenticate,
      this.transactionController.getTransactionHistory.bind(this.transactionController)
    );

    // GET /api/transactions/deposits
    this.router.get(
      '/deposits',
      AuthMiddleware.authenticate,
      this.transactionController.getDeposits.bind(this.transactionController)
    );

    // GET /api/transactions/transfers
    this.router.get(
      '/transfers',
      AuthMiddleware.authenticate,
      this.transactionController.getTransfers.bind(this.transactionController)
    );

    // GET /api/transactions/:reference
    this.router.get(
      '/:reference',
      AuthMiddleware.authenticate,
      this.transactionController.getTransactionByReference.bind(this.transactionController)
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
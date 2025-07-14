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
    this.router.post(
      '/transfer',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(TransactionValidator.validateTransfer),
      this.transactionController.initiateTransfer.bind(this.transactionController)
    );
    this.router.post(
      '/resolve-account',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(TransactionValidator.resolveAccountNumber),
      this.transactionController.resolveAccountNumber.bind(this.transactionController)
    );
    this.router.get(
      '/banks',
      AuthMiddleware.authenticate,
      this.transactionController.fetchBanks.bind(this.transactionController)
    );
    this.router.get(
      '/history',
      AuthMiddleware.authenticate,
      this.transactionController.getTransactionHistory.bind(this.transactionController)
    );

    this.router.get(
      '/deposits',
      AuthMiddleware.authenticate,
      this.transactionController.getDeposits.bind(this.transactionController)
    );

    this.router.get(
      '/transfers',
      AuthMiddleware.authenticate,
      this.transactionController.getTransfers.bind(this.transactionController)
    );

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
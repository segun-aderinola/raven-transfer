import { Router } from 'express';
import { BankAccountController } from '@/controllers/BankAccountController';
import { AuthMiddleware } from '@/middleware/AuthMiddleware';

export class BankAccountRoutes {
  private router: Router;
  private bankAccountController: BankAccountController;

  constructor() {
    this.router = Router();
    this.bankAccountController = new BankAccountController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /api/bank-accounts
    // this.router.get(
    //   '/',
    //   AuthMiddleware.authenticate,
    //   this.bankAccountController.getUserBankAccounts.bind(this.bankAccountController)
    // );
  }

  public getRouter(): Router {
    return this.router;
  }
}
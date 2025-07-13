import { Response, Request } from 'express';
import { BankAccountService } from '@/services/BankAccountService';
import { ResponseDto } from '@/dto/ResponseDto';
import { AuthenticatedRequest } from '@/middleware/AuthMiddleware';

export class BankAccountController {
  private bankAccountService: BankAccountService;

  constructor() {
    this.bankAccountService = new BankAccountService();
  }

  public async getUserBankAccounts(req: Request, res: Response): Promise<void> {
    try {
      const accounts = await this.bankAccountService.getUserBankAccounts(req.user!.id);
      res.json(ResponseDto.success('Bank accounts retrieved successfully', accounts));
    } catch (error: any) {
      res.status(500).json(ResponseDto.error(error.message));
    }
  }
}
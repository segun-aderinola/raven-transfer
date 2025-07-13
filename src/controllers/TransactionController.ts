import { Response, Request } from 'express';
import { TransactionService } from '@/services/TransactionService';
import { ResponseDto } from '@/dto/ResponseDto';
import { AuthenticatedRequest } from '@/middleware/AuthMiddleware';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  public async initiateTransfer(req: Request, res: Response): Promise<void> {
    try {
      const transaction = await this.transactionService.initiateTransfer(req.user!.id, req.body);
      res.status(201).json(ResponseDto.success('Transfer initiated successfully', transaction));
    } catch (error: any) {
      res.status(400).json(ResponseDto.error(error.message));
    }
  }

  public async getTransactionHistory(req: Request, res: Response): Promise<void> {
    try {
      const { limit = '50', offset = '0' } = req.query;
      const transactions = await this.transactionService.getUserTransactions(
        req.user!.id,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.json(ResponseDto.success('Transaction history retrieved successfully', transactions));
    } catch (error: any) {
      res.status(500).json(ResponseDto.error(error.message));
    }
  }

  public async getDeposits(req: Request, res: Response): Promise<void> {
    try {
      const deposits = await this.transactionService.getTransactionsByType(req.user!.id, 'deposit');
      res.json(ResponseDto.success('Deposits retrieved successfully', deposits));
    } catch (error: any) {
      res.status(500).json(ResponseDto.error(error.message));
    }
  }

  public async getTransfers(req: Request, res: Response): Promise<void> {
    try {
      const transfers = await this.transactionService.getTransactionsByType(req.user!.id, 'transfer');
      res.json(ResponseDto.success('Transfers retrieved successfully', transfers));
    } catch (error: any) {
      res.status(500).json(ResponseDto.error(error.message));
    }
  }

  public async getTransactionByReference(req: Request, res: Response): Promise<void> {
    try {
      const { reference } = req.params;
      const transaction = await this.transactionService.getTransactionByReference(String(reference));
      
      if (!transaction || transaction.user_id !== req.user!.id) {
        res.status(404).json(ResponseDto.error('Transaction not found'));
        return;
      }

      res.json(ResponseDto.success('Transaction retrieved successfully', transaction));
    } catch (error: any) {
      res.status(500).json(ResponseDto.error(error.message));
    }
  }
}
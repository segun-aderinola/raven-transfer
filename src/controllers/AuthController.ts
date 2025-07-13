import { Request, Response } from 'express';
import { AuthService } from '@/services/AuthService';
import { ResponseDto } from '@/dto/ResponseDto';
import { User } from '@/models/User';
import { Wallet } from '@/models/Wallet';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(ResponseDto.success('User registered successfully', result));
    } catch (error: any) {
      res.status(400).json(ResponseDto.error(error.message));
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      res.json(ResponseDto.success('Login successful', result));
    } catch (error: any) {
      res.status(401).json(ResponseDto.error(error.message));
    }
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userModel = new User();
      const walletModel = new Wallet();
      const user = await userModel.findById(req.user!.id);
      const wallet = await walletModel.findByUserId(req.user!.id);
      if (!user) {
        res.status(404).json(ResponseDto.error('User not found'));
        return;
      }
      const { password, ...userWithoutPassword } = user;
      res.json(ResponseDto.success('Profile retrieved successfully', {
        user: userWithoutPassword,
        wallet: {
          account_number: wallet?.account_number,
          balance: wallet?.balance,
          bank_name: wallet?.bank_name,
        }
      }));
    } catch (error: any) {
      res.status(500).json(ResponseDto.error(error.message));
    }
  }
}
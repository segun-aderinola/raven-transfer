import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { BankAccountService } from './BankAccountService';
import { RegisterDto, LoginDto } from '@/dto/AuthDto';
import { IUserWithoutPassword } from '@/interfaces/User.interface';
import { JwtPayload } from '@/types';

interface AuthResult {
  user: IUserWithoutPassword;
  token: string;
}

export class AuthService {
  private userModel: User;
  private bankAccountService: BankAccountService;

  constructor() {
    this.userModel = new User();
    this.bankAccountService = new BankAccountService();
  }

  public async register(userData: any): Promise<AuthResult> {
    const registerDto = new RegisterDto(userData);
    
    // Check if user exists
    const existingUser = await this.userModel.findByEmail(registerDto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user
    const user = await this.userModel.createUser(registerDto);
    
    // Create virtual bank account
    await this.bankAccountService.createVirtualAccount(user);

    // Generate token
    const token = this.generateToken(user);

    return {
      user,
      token
    };
  }

  public async login(credentials: any): Promise<AuthResult> {
    const loginDto = new LoginDto(credentials);
    
    // Find user
    const user = await this.userModel.findByEmail(loginDto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await this.userModel.verifyPassword(loginDto.password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;

    // Generate token
    const token = this.generateToken(userWithoutPassword);

    return {
      user: userWithoutPassword,
      token
    };
  }

  private generateToken(user: IUserWithoutPassword): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
  }

  public verifyToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  }
}
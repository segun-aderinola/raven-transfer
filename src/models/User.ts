import bcrypt from 'bcryptjs';
import { BaseModel } from './BaseModel';
import { IUser, ICreateUser, IUserWithoutPassword } from '@/interfaces/User.interface';

export class User extends BaseModel<IUser> {
  constructor() {
    super('users');
  }

  public async createUser(userData: ICreateUser): Promise<IUserWithoutPassword> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.create({
      ...userData,
      password: hashedPassword
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    return await this.findOneBy({ email } as Partial<IUser>);
  }

  public async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
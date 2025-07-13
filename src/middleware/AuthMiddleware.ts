import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseDto } from '@/dto/ResponseDto';
import { JwtPayload } from '@/types';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export class AuthMiddleware {
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json(ResponseDto.error('Access denied. No token provided.'));
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json(ResponseDto.error('Invalid token.'));
    }
  }
}

export { AuthenticatedRequest };
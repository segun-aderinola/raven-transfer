import { Request, Response, NextFunction } from 'express';
import { ResponseDto } from '@/dto/ResponseDto';

export class ErrorMiddleware {
  public static handle(err: any, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json(ResponseDto.error('Duplicate entry'));
      return;
    }

    if (err.name === 'ValidationError') {
      res.status(400).json(ResponseDto.error(err.message));
      return;
    }

    if (err.name === 'JsonWebTokenError') {
      res.status(401).json(ResponseDto.error('Invalid token'));
      return;
    }

    if (err.name === 'TokenExpiredError') {
      res.status(401).json(ResponseDto.error('Token expired'));
      return;
    }

    res.status(500).json(ResponseDto.error('Internal server error'));
  }

  public static notFound(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json(ResponseDto.error('Route not found'));
  }
}
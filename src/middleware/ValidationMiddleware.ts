import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ResponseDto } from '@/dto/ResponseDto';

export class ValidationMiddleware {
  public static validate(validator: (data: any) => Joi.ValidationResult) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = validator(req.body);
      if (error?.details?.length) {
        res.status(400).json(ResponseDto.error(error?.details[0]?.message || 'Validation error'));
        return;
      }
      next();
    };
  }
}
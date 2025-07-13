import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export class ValidationMiddleware {
  public static validate(validationFunction: (data: any) => Joi.ValidationResult) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = validationFunction(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map((detail: any) => detail.message)
        });
        return;
      }
      
      next();
    };
  }
}
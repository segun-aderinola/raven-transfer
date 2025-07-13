import Joi from 'joi';

export class AuthValidator {
  private static registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().optional()
  });

  private static loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  public static validateRegister(data: any): Joi.ValidationResult {
    return this.registerSchema.validate(data);
  }

  public static validateLogin(data: any): Joi.ValidationResult {
    return this.loginSchema.validate(data);
  }
}
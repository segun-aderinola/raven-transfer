import Joi from 'joi';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  bvn: Joi.string().length(11).required(),
  nin: Joi.string().required(),
  phone: Joi.string().length(11).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export class AuthValidator {
  public static validateRegister(data: any): Joi.ValidationResult {
    return registerSchema.validate(data);
  }

  public static validateLogin(data: any): Joi.ValidationResult {
    return loginSchema.validate(data);
  }
}
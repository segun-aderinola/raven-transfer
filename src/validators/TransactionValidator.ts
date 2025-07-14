import Joi from 'joi';

const transferSchema = Joi.object({
  account_number: Joi.string().required(),
  account_name: Joi.string().required(),
  bank: Joi.string().required(),
  bank_code: Joi.string().required(),
  amount: Joi.number().positive().max(100).required(),
  description: Joi.string().optional(),
});

const depositSchema = Joi.object({
  amount: Joi.number().positive().max(100).required()
});

const resolveAccountNumberSchema = Joi.object({
  bank_code: Joi.string().required(),
  account_number: Joi.string().required()
});

export class TransactionValidator {
  public static validateTransfer(data: any): Joi.ValidationResult {
    return transferSchema.validate(data);
  }

  public static validateDeposit(data: any): Joi.ValidationResult {
    return depositSchema.validate(data);
  }

  public static resolveAccountNumber(data: any): Joi.ValidationResult {
    return resolveAccountNumberSchema.validate(data);
  }
}
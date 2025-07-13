import Joi from 'joi';

export class TransactionValidator {
  private static transferSchema = Joi.object({
    recipient_account: Joi.string().required(),
    recipient_bank: Joi.string().required(),
    amount: Joi.number().positive().max(100).required(),
    description: Joi.string().optional(),
    currency: Joi.string().valid('NGN').default('NGN')
  });

  private static depositSchema = Joi.object({
    amount: Joi.number().positive().max(100).required(),
    currency: Joi.string().valid('NGN').default('NGN')
  });

  public static validateTransfer(data: any): Joi.ValidationResult {
    return this.transferSchema.validate(data);
  }

  public static validateDeposit(data: any): Joi.ValidationResult {
    return this.depositSchema.validate(data);
  }
}
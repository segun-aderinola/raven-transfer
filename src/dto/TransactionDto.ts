export class TransferDto {
    public recipient_account: string;
    public recipient_bank: string;
    public amount: number;
    public description?: string;
    public currency: string;
  
    constructor(data: {
      recipient_account: string;
      recipient_bank: string;
      amount: number;
      description?: string;
      currency?: string;
    }) {
      this.recipient_account = data.recipient_account;
      this.recipient_bank = data.recipient_bank;
      this.amount = data.amount;
      this.description = data.description;
      this.currency = data.currency || 'NGN';
    }
  }
  
  export class DepositDto {
    public amount: number;
    public currency: string;
  
    constructor(data: { amount: number; currency?: string }) {
      this.amount = data.amount;
      this.currency = data.currency || 'NGN';
    }
  }
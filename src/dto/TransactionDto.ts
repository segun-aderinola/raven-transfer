export class TransferDto {
    public account_number: string;
    public bank: string;
    public bank_code: string;
    public amount: number;
    public account_name: string;
    
  
    constructor(data: {
      account_number: string;
      bank: string;
      bank_code: string;
      amount: number;
      account_name: string
    }) {
      this.account_number = data.account_number;
      this.bank = data.bank;
      this.bank_code = data.bank_code;
      this.amount = data.amount;
      this.account_name = data.account_name;
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
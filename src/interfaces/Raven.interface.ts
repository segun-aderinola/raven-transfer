export interface IRavenAccountData {
    first_name: string;
    last_name: string;
    bvn: string;
    nin: string;
    email: string;
    phone?: string;
  }
  
  export interface IRavenTransferData {
    amount: number;
    currency: string;
    account_number: string;
    account_name: string;
    bank: string;
    bank_code: string;
    reference: string;
    description?: string;
  }

  export interface IRavenResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
  }
  
  export interface IRavenAccount {
    id: string;
    account_number: string;
    account_name: string;
    bank_name: string;
    bank_code: string;
  }
  
  export interface IRavenTransfer {
    id: string;
    email: string;
    trx_ref: string;
    merchant_ref: string;
    amount: number;
    status: string;
    bank: string;
    bank_code: string;
    account_number: string;
    account_name: string;
    narration: string;
    fee: number;
    created_at: any;
  }
  
  export interface IRavenAccountVerification {
    valid: boolean;
    account_name?: string;
    account_number: string;
    bank_code: string;
  }
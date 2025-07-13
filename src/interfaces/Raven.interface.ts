export interface IRavenAccountData {
    name: string;
    email: string;
    phone?: string;
  }
  
  export interface IRavenTransferData {
    amount: number;
    currency: string;
    recipient_account: string;
    recipient_bank: string;
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
    reference: string;
    amount: number;
    status: string;
  }
  
  export interface IRavenAccountVerification {
    valid: boolean;
    account_name?: string;
    account_number: string;
    bank_code: string;
  }
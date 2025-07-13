import axios, { AxiosInstance } from 'axios';
import {
  IRavenAccountData,
  IRavenTransferData,
  IRavenAccount,
  IRavenTransfer,
  IRavenAccountVerification
} from '@/interfaces/Raven.interface';

export class RavenService {
  private baseURL: string;
  private apiKey: string;
  private secretKey: string;
  private client: AxiosInstance;

  constructor() {
    this.baseURL = process.env.RAVEN_BASE_URL!;
    this.apiKey = process.env.RAVEN_API_KEY!;
    this.secretKey = process.env.RAVEN_SECRET_KEY!;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  public async createVirtualAccount(data: IRavenAccountData): Promise<IRavenAccount> {
    try {
      const response = await this.client.post('/accounts', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        webhook_url: process.env.WEBHOOK_URL
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Raven API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  public async initiateTransfer(data: IRavenTransferData): Promise<IRavenTransfer> {
    try {
      const response = await this.client.post('/transfers', {
        amount: data.amount,
        currency: data.currency,
        recipient: {
          account_number: data.recipient_account,
          bank_code: data.recipient_bank
        },
        reference: data.reference,
        description: data.description
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Raven API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  public async verifyAccount(accountNumber: string, bankCode: string): Promise<IRavenAccountVerification> {
    try {
      const response = await this.client.get(`/accounts/verify?account_number=${accountNumber}&bank_code=${bankCode}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Raven API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  public async getBanks(): Promise<any[]> {
    try {
      const response = await this.client.get('/banks');
      return response.data;
    } catch (error: any) {
      throw new Error(`Raven API Error: ${error.response?.data?.message || error.message}`);
    }
  }
}
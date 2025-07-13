import { WebhookStatus } from '@/types';

export interface IWebhook {
  id: number;
  event_type: string;
  reference: string;
  payload: Record<string, any>;
  status: WebhookStatus;
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateWebhook {
  event_type: string;
  reference: string;
  payload: Record<string, any>;
}
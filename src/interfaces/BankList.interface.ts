export interface IBankListData {
    bank_code: string;
    bank_name: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date | null;
  }
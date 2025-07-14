import { IBankListData } from "@/interfaces/BankList.interface";
import { BaseModel } from "./BaseModel";
import { Knex } from "knex";

export class BankList extends BaseModel<IBankListData> {
  constructor() {
    super("bank_lists");
  }

  public async findAllBanks(): Promise<IBankListData[]> {
    return await this.findAll();
  }

  public async findByBankCode(
    bank_code: string
  ): Promise<IBankListData | undefined> {
    return await this.findOneBy({ bank_code } as Partial<IBankListData>);
  }

  public async findAllActiveBanks(): Promise<IBankListData[]> {
    return await this.db(this.tableName)
      .where("deleted_at", null)
      .orWhereNull("deleted_at");
  }

  public async bulkInsert(
    banks: Partial<IBankListData>[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const query = trx ? trx(this.tableName) : this.db(this.tableName);

    if (banks.length > 0) {
      await query.insert(banks);
    }
  }

}

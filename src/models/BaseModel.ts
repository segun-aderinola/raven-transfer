import { Knex } from 'knex';
import database from '@/config/database';

export abstract class BaseModel<T = any> {
  protected tableName: string;
  protected db: Knex;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = database.getConnection();
  }

  public async findAll(): Promise<T[]> {
    return await this.db(this.tableName).select('*');
  }

  public async findById(id: number): Promise<T | undefined> {
    return await this.db(this.tableName).where({ id }).first();
  }

  public async create(data: Partial<T>): Promise<T> {
    const [id] = await this.db(this.tableName).insert(data);
    return await this.findById(id!) as T;
  }

  public async update(id: number, data: Partial<T>): Promise<T> {
    await this.db(this.tableName).where({ id }).update(data);
    return await this.findById(id) as T;
  }

  public async delete(id: number): Promise<number> {
    return await this.db(this.tableName).where({ id }).del();
  }

  public async findBy(criteria: Partial<T>): Promise<T[]> {
    return await this.db(this.tableName).where(criteria);
  }

  public async findOneBy(criteria: Partial<T>): Promise<T | undefined> {
    return await this.db(this.tableName).where(criteria).first();
  }
}
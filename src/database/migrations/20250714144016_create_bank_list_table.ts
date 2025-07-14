import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bank_lists', (table) => {
    table.increments('id').primary();
    table.string('bank_name').unique().notNullable();
    table.string('bank_code').notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.string('deleted_at').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index(['bank_code']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('bank_lists');
}
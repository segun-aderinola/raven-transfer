import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallets', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('account_number').unique().notNullable();
    table.string('account_name').notNullable();
    table.decimal('balance', 15, 2).defaultTo(0);
    table.decimal('locked_amount', 15, 2).defaultTo(0);
    table.string('bank_name').notNullable();
    table.string('bank_code').notNullable();
    table.string('raven_account_id').nullable();
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.timestamps(true, true);
    
    // Foreign key
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index(['user_id']);
    table.index(['account_number']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('wallets');
}
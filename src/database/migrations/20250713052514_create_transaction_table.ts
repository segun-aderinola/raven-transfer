import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('reference').unique().notNullable();
    table.enum('type', ['deposit', 'transfer', 'withdrawal']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.string('currency', 3).defaultTo('NGN');
    table.enum('status', ['pending', 'processing', 'completed', 'failed']).defaultTo('pending');
    table.text('description').nullable();
    table.string('recipient_account').nullable();
    table.string('recipient_bank').nullable();
    table.string('raven_transaction_id').nullable();
    table.json('metadata').nullable();
    table.timestamps(true, true);
    
    // Foreign key
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes
    table.index(['user_id']);
    table.index(['reference']);
    table.index(['type']);
    table.index(['status']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('transactions');
}
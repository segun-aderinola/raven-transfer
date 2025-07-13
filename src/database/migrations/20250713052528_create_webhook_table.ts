import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('webhooks', (table) => {
    table.increments('id').primary();
    table.string('event_type').notNullable();
    table.string('reference').notNullable();
    table.json('payload').notNullable();
    table.enum('status', ['received', 'processed', 'failed']).defaultTo('received');
    table.timestamp('processed_at').nullable();
    table.timestamps(true, true);
    
    // Indexes
    table.index(['reference']);
    table.index(['event_type']);
    table.index(['status']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('webhooks');
}
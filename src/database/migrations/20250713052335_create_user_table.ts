import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('phone').nullable();
    table.string('bvn').notNullable();
    table.string('nin').notNullable();
    table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active');
    table.timestamps(true, true);
    
    // Indexes
    table.index(['email']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
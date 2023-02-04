const {
  addCreateTrace,
  addUpdateTrace,
  addArchiveTrace,
} = require('./utils/tracing');
const { getGenUUID } = require('./utils/uuid');

const DONATIONS_TABLE = 'donations';
const DONATION_ENTRY_TABLE = 'donation_entries';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('donations', (table) => {
    table.uuid('id').primary().notNullable().defaultTo(getGenUUID(knex));
    table
      .uuid('organization_id')
      .notNullable()
      .references('id')
      .inTable('organizations')
      .onUpdate('RESTRICT')
      .onDelete('RESTRICT');
    table.text('external_id').nullable();
    table.enum('environment', ['sandbox', 'live']).notNullable();

    table.smallint('fiscal_year').notNullable();
    table.text('reason').nullable();
    table.enum('type', ['oneTime', 'recurrent']).notNullable();
    table.string('currency', 3).notNullable();
    table
      .enum('source', ['paypal', 'cheque', 'directDeposit', 'stocks', 'other'])
      .notNullable();

    table.text('donor_first_name').nullable();
    table.text('donor_last_name_or_org_name').notNullable();
    table.text('donor_email').nullable();
    table.jsonb('donor_address').nullable();

    table.boolean('should_emit_receipt');
    table.boolean('should_email_receipt');

    table.index(['organization_id', 'environment']);

    addCreateTrace(knex, table);
    addUpdateTrace(table);
    addArchiveTrace(table);
  });

  await knex.schema.createTable(DONATION_ENTRY_TABLE, (table) => {
    table.uuid('id').primary().notNullable().defaultTo(getGenUUID(knex));
    table.text('external_id').nullable();
    table
      .uuid('donation_id')
      .notNullable()
      .references('id')
      .inTable('donations')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.bigInteger('amount').notNullable().checkPositive();

    table.bigInteger('receipt_amount').notNullable();
    table.check('?? >= 0', ['receipt_amount']);

    table.timestamp('received_at', {
      useTz: true,
    });

    addCreateTrace(knex, table);
    addArchiveTrace(table);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable(DONATION_ENTRY_TABLE);
  await knex.schema.dropTable(DONATIONS_TABLE);
};

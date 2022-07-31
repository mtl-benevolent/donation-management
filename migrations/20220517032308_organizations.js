const {
  addCreateTrace,
  addUpdateTrace,
  addArchiveTrace,
} = require('./utils/tracing');

const ORGANIZATIONS_TABLE = 'organizations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable(ORGANIZATIONS_TABLE, (table) => {
    table
      .uuid('id')
      .primary()
      .notNullable()
      .defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('slug', 1024).notNullable().unique();
    table.string('logo_url', 1024).nullable();

    table.jsonb('locales').notNullable();
    table.jsonb('smtp_settings').nullable();

    table.index('slug');

    addCreateTrace(knex, table);
    addUpdateTrace(table);
    addArchiveTrace(table);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable(ORGANIZATIONS_TABLE);
};

exports.config = {
  transaction: false,
};

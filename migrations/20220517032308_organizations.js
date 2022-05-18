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
  await knex.schema.createTable(ORGANIZATIONS_TABLE, (orgTable) => {
    orgTable
      .uuid('id')
      .primary()
      .notNullable()
      .defaultTo(knex.raw('gen_random_uuid()'));
    orgTable.string('name', 255).notNullable();
    orgTable.string('slug', 1024).notNullable().unique();
    orgTable.string('logoUrl', 1024);

    orgTable.jsonb('smtpSettings');

    addCreateTrace(knex, orgTable);
    addUpdateTrace(orgTable);
    addArchiveTrace(orgTable);
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

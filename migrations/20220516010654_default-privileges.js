/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.raw(
    'alter default privileges grant select, insert, update, delete on tables, sequences to "donations_rw"'
  );

  // Grant drop permission to enable TRUNCATE to work
  await knex.schema.raw('alter default privileges grant drop on tables, sequences to "donations_maintenance"')
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function () {
  console.log('No implementation');
};

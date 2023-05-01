/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.raw(
    'alter default privileges grant select, insert, update, delete on tables to "donations_rw"'
  );
  
  await knex.schema.raw(
    'alter default privileges grant select, update on sequences to "donations_rw"'
  );

  // Grant drop permission to enable TRUNCATE to work
  await knex.schema.raw('alter default privileges grant drop on tables to "donations_maintenance"')
  await knex.schema.raw('alter default privileges grant drop on sequences to "donations_maintenance"')
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function () {
  console.log('No implementation');
};

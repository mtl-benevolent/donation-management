/**
 * @param { import("knex").Knex } knex
 * @returns { import("knex").Knex.Raw }
 */
function getGenUUID(knex) {
  return knex.raw('gen_random_uuid()');
}

module.exports = {
  getGenUUID,
};

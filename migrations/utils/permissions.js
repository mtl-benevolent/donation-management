exports.grantPermissionsToApp = async function grantPermissionsToApp(
  knex,
  table
) {
  await knex.raw(
    `GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ${table} TO donations_rw`
  );
};

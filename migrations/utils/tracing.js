exports.addCreateTrace = function addCreateTrace(knex, table) {
  table
    .timestamp('created_at', { useTz: false })
    .notNullable()
    .defaultTo(knex.fn.now());

  table.string('created_by', 255).notNullable();
};

exports.addUpdateTrace = function addUpdateTrace(table) {
  table.timestamp('updated_at', { useTz: false });
  table.string('updated_by', 255);
};

exports.addArchiveTrace = function addArchiveTrace(table) {
  table.timestamp('archived_at', { useTz: false });
  table.string('archived_by', 255);
};

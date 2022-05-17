exports.addCreateTrace = function addCreateTrace(knex, table) {
  table
    .timestamp('createdAt', { useTz: false })
    .notNullable()
    .defaultTo(knex.fn.now());

  table.string('createdBy', 255).notNullable();
};

exports.addUpdateTrace = function addUpdateTrace(table) {
  table.timestamp('updatedAt', { useTz: false });
  table.string('updatedBy', 255);
};

exports.addArchiveTrace = function addArchiveTrace(table) {
  table.timestamp('archivedAt', { useTz: false });
  table.string('archivedBy', 255);
};

exports.up = function (knex) {
  return knex.schema.createTable('global', function (table) {
    table.string('id', 64).notNullable().defaultTo('')
    table.string('str', 256).nullable()
    table.integer('num', 11).nullable()
    table.primary('id')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('global')
}

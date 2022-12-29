exports.up = function (knex) {
  return knex.schema.createTable('distributor', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('name', 256).nullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('distributor')
}

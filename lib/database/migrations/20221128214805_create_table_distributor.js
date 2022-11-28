exports.up = function (knex, Promise) {
  return knex.schema.createTable('distributor', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('name', 256).nullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('distributor')
}

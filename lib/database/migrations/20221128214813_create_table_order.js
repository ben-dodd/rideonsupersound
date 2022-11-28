exports.up = function (knex, Promise) {
  return knex.schema.createTable('order', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('created_by', 11).nullable()
    table.time('date_created').nullable()
    table.integer('distributor_id', 11).nullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('order')
}

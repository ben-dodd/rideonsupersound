exports.up = function (knex, Promise) {
  return knex.schema.createTable('order_line_item', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('order_id', 11).nullable()
    table.integer('distributor_stock_id', 11).nullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('order_line_item')
}

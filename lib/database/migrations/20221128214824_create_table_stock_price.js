exports.up = function (knex) {
  return knex.schema.createTable('stock_price', function (table) {
    table.increments('id').notNullable()
    table.integer('stock_id', 11).notNullable()
    table.integer('clerk_id', 11).nullable()
    table.integer('vendor_cut', 11).nullable()
    table.integer('total_sell', 11).nullable()
    table.time('date_valid_from').notNullable().defaultTo(knex.fn.now())
    table.string('note', 256).nullable()
    table.integer('is_deleted', 1).defaultTo('0')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('stock_price')
}

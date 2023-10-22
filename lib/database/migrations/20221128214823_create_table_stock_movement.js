export const up = function (knex) {
  return knex.schema.createTable('stock_movement', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('stock_id', 11).nullable()
    table.integer('clerk_id', 11).nullable()
    table.integer('quantity', 11).nullable()
    table.integer('sale_id', 11).nullable()
    table.integer('hold_id', 11).nullable()
    table.integer('register_id', 11).nullable()
    table.integer('stocktake_id', 11).nullable()
    table.string('act', 16).nullable()
    table.string('note', 256).nullable()
    table.time('date_moved').defaultTo(knex.fn.now())
    table.integer('is_deleted', 1).defaultTo('0')
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('stock_movement')
}

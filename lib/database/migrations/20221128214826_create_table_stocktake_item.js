exports.up = function (knex) {
  return knex.schema.createTable('stocktake_item', function (table) {
    table.string('id', 64).notNullable().defaultTo('')
    table.integer('stock_id', 11).nullable()
    table.integer('stocktake_id', 11).nullable()
    table.integer('quantity_counted', 11).nullable()
    table.integer('quantity_recorded', 11).nullable()
    table.integer('quantity_difference', 11).nullable()
    table.string('review_decision', 128).nullable()
    table.time('date_counted').nullable()
    table.integer('counted_by', 11).nullable()
    table.integer('do_check_details', 1).defaultTo('0')
    table.integer('is_deleted', 1).notNullable().defaultTo('0')
    table.primary('id')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('stocktake_item')
}

exports.up = function (knex, Promise) {
  return knex.schema.createTable('stocktake', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('stocktake_template_id', 11).nullable()
    table.time('date_started').nullable()
    table.integer('started_by', 11).nullable()
    table.time('date_closed').nullable()
    table.integer('closed_by', 11).nullable()
    table.time('date_cancelled').nullable()
    table.integer('cancelled_by', 11).nullable()
    table.integer('total_counted', 11).nullable()
    table.integer('total_unique_counted', 11).nullable()
    table.integer('total_estimated', 11).nullable()
    table.integer('total_unique_estimated', 11).nullable()
    table.integer('is_deleted', 1).defaultTo('0')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('stocktake')
}

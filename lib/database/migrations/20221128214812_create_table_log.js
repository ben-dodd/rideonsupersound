exports.up = function (knex) {
  return knex.schema.createTable('log', function (table) {
    table.increments('id').notNullable()
    table.string('log', 256).nullable()
    table.integer('clerk_id', 11).nullable()
    table.string('table_id', 128).nullable()
    table.integer('row_id', 11).nullable()
    table.time('date_created').nullable()
    table.integer('is_deleted', 1).notNullable().defaultTo('0')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('log')
}

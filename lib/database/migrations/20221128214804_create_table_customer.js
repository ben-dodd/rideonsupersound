exports.up = function (knex) {
  return knex.schema.createTable('customer', function (table) {
    table.increments('id').notNullable()
    table.string('name', 256).nullable()
    table.string('email', 256).nullable()
    table.string('phone', 256).nullable()
    table.string('postal_address', 256).nullable()
    table.string('note', 256).nullable()
    table.integer('created_by_clerk_id', 11).nullable()
    table.time('date_created').notNullable().defaultTo(knex.fn.now())
    table.time('date_modified').notNullable().defaultTo(knex.fn.now())
    table.integer('is_deleted', 1).notNullable().defaultTo('0')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('customer')
}

export const up = function (knex) {
  return knex.schema.createTable('hold', function (table) {
    table.increments('id').notNullable()
    table.integer('customer_id', 11).nullable()
    table.integer('item_id', 11).nullable()
    table.integer('quantity', 11).nullable()
    table.integer('vendor_discount', 11).nullable()
    table.integer('store_discount', 11).nullable()
    table.integer('hold_period', 11).notNullable()
    table.time('date_from').notNullable().defaultTo(knex.fn.now())
    table.integer('started_by', 11).nullable()
    table.time('date_removed_from_hold').nullable()
    table.integer('removed_from_hold_by', 11).nullable()
    table.integer('is_sold', 1).notNullable().defaultTo('0')
    table.string('note', 256).nullable()
    table.time('date_created').notNullable().defaultTo(knex.fn.now())
    table.time('date_modified').notNullable().defaultTo(knex.fn.now())
    table.integer('is_deleted', 1).notNullable().defaultTo('0')
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('hold')
}

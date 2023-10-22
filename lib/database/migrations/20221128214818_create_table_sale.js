export const up = function (knex) {
  return knex.schema.createTable('sale', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('customer_id', 11).nullable()
    table.string('state', 32).nullable()
    table.time('date_sale_opened').nullable()
    table.integer('sale_opened_by', 11).nullable()
    table.time('date_sale_closed').nullable()
    table.integer('sale_closed_by', 11).nullable()
    table.time('date_layby_started').nullable()
    table.integer('layby_started_by', 11).nullable()
    table.integer('store_cut', 11).nullable()
    table.integer('total_price', 11).nullable()
    table.integer('number_of_items', 11).nullable()
    table.string('item_list', 256).nullable()
    table.integer('is_mail_order', 1).defaultTo('0')
    table.text('postal_address')
    table.text('cash_note')
    table.text('note')
    table.string('geo_latitude', 32).nullable()
    table.string('geo_longitude', 32).nullable()
    table.integer('is_deleted', 1).defaultTo(0)
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('sale')
}

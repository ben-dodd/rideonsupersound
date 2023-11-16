export async function up(knex): Promise<any> {
  return knex.schema.createTable('sale_item', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('sale_id', 11).nullable()
    table.integer('item_id', 11).nullable()
    table.integer('quantity', 11).nullable()
    table.integer('vendor_discount', 11).nullable()
    table.integer('store_discount', 11).nullable()
    table.string('note', 256).nullable()
    table.integer('is_gift_card', 1).defaultTo('0')
    table.integer('is_misc_item', 1).defaultTo('0')
    table.integer('is_refunded', 1).defaultTo('0')
    table.string('refund_note', 256).nullable()
    table.datetime('date_refunded').nullable()
    table.integer('is_deleted', 1).notNullable().defaultTo('0')
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('sale_item')
}

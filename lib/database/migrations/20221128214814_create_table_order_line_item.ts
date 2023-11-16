export async function up(knex): Promise<any> {
  return knex.schema.createTable('order_line_item', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('order_id', 11).nullable()
    table.integer('distributor_stock_id', 11).nullable()
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('order_line_item')
}

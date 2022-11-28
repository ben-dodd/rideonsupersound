exports.up = function (knex, Promise) {
  return knex.schema.createTable('sale_transaction', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('sale_id', 11).nullable()
    table.integer('clerk_id', 11).nullable()
    table.time('date').nullable()
    table.string('payment_method', 32).nullable()
    table.integer('amount', 11).nullable()
    table.integer('cash_received', 11).nullable()
    table.integer('change_given', 11).nullable()
    table.integer('vendor_payment_id', 11).nullable()
    table.integer('gift_card_id', 11).nullable()
    table.integer('gift_card_remaining', 11).nullable()
    table.integer('gift_card_taken', 1).defaultTo('0')
    table.integer('gift_card_change', 11).nullable()
    table.integer('register_id', 11).nullable()
    table.integer('is_refund', 1).defaultTo('0')
    table.integer('is_deleted', 1).defaultTo('0')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('sale_transaction')
}

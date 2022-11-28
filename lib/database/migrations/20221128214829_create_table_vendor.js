exports.up = function (knex, Promise) {
  return knex.schema.createTable('vendor', function (table) {
    table.increments('id').notNullable()
    table.string('name', 128).nullable()
    table.string('vendor_category', 64).nullable()
    table.integer('clerk_id', 11).nullable()
    table.string('bank_account_number', 64).nullable()
    table.string('contact_name', 128).nullable()
    table.string('email', 64).nullable()
    table.string('phone', 24).nullable()
    table.string('postal_address', 256).nullable()
    table.string('note', 256).nullable()
    table.time('last_contacted').nullable()
    table.integer('store_credit_only', 1).defaultTo('0')
    table.integer('email_vendor', 1).defaultTo('1')
    table.time('date_created').notNullable().defaultTo(knex.fn.now())
    table.time('date_modified').notNullable().defaultTo(knex.fn.now())
    table.string('uid', 64).nullable()
    table.integer('is_deleted', 1).defaultTo('0')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('vendor')
}

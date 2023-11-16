export async function up(knex): Promise<any> {
  return knex.schema.createTable('vendor_payment', function (table) {
    table.increments('id').notNullable()
    table.integer('clerk_id', 11).nullable()
    table.integer('vendor_id', 11).nullable()
    table.integer('register_id', 11).nullable()
    table.integer('amount', 11).nullable()
    table.string('bank_account_number', 64).nullable()
    table.string('batch_number', 64).nullable()
    table.integer('sale_id', 11).nullable()
    table.time('date').nullable().defaultTo(knex.fn.now())
    table.string('sequence_number', 64).nullable()
    table.string('bank_reference', 128).nullable()
    table.string('type', 16).nullable()
    table.text('note')
    table.integer('is_deleted', 1).defaultTo(0)
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('vendor_payment')
}

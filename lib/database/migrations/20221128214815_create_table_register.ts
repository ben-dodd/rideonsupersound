export async function up(knex): Promise<any> {
  return knex.schema.createTable('register', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('opened_by_id', 11).nullable()
    table.time('open_date').nullable().defaultTo(knex.fn.now())
    table.integer('open_amount', 11).nullable()
    table.string('open_note', 256).nullable()
    table.integer('open_till_id', 11).nullable()
    table.integer('closed_by_id', 11).nullable()
    table.time('close_date').nullable()
    table.integer('close_till_id', 11).nullable()
    table.integer('close_amount', 11).nullable()
    table.integer('close_petty_balance', 11).nullable()
    table.integer('close_cash_given', 11).nullable()
    table.integer('close_manual_payments', 11).nullable()
    table.integer('close_expected_amount', 11).nullable()
    table.integer('close_discrepancy', 11).nullable()
    table.string('close_note', 256).nullable()
  })
}

export async function down(knex): Promise<any> {
  return knex.schema.dropTable('register')
}

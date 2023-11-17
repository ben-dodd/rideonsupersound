export async function up(knex): Promise<any> {
  return knex.schema.createTable('register_petty_cash', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('register_id', 11).nullable()
    table.integer('clerk_id', 11).nullable()
    table.integer('amount', 11).nullable()
    table.integer('is_take', 1).nullable()
    table.string('note', 256).nullable()
    table.time('date').nullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex): Promise<any> {
  return knex.schema.dropTable('register_petty_cash')
}

export async function up(knex): Promise<any> {
  return knex.schema.createTable('distributor_stocklist', function (table) {
    table.increments('id').unsigned().notNullable()
    table.time('date_created').nullable()
    table.integer('created_by', 11).nullable()
    table.time('date_updated').nullable()
  })
}

export async function down(knex): Promise<any> {
  return knex.schema.dropTable('distributor_stocklist')
}

export async function up(knex): Promise<any> {
  return knex.schema.createTable('distributor', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('name', 256).nullable()
  })
}

export async function down(knex): Promise<any> {
  return knex.schema.dropTable('distributor')
}

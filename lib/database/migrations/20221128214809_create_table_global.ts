export async function up(knex): Promise<any> {
  return knex.schema.createTable('global', function (table) {
    table.string('id', 64).notNullable().defaultTo('')
    table.string('str', 256).nullable()
    table.integer('num', 11).nullable()
    table.primary('id')
  })
}

export async function down(knex): Promise<any> {
  return knex.schema.dropTable('global')
}

export async function up(knex): Promise<any> {
  return knex.schema.createTable('account', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('email', 256).nullable()
    table.integer('is_admin', 1).defaultTo('0')
    table.integer('is_buyer', 1).defaultTo('0')
    table.integer('is_authenticated', 1).defaultTo('1')
  })
}

export async function down(knex): Promise<any> {
  return knex.schema.dropTable('account')
}

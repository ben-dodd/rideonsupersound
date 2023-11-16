export async function up(knex): Promise<any> {
  return knex.schema.createTable('clerk', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('name', 32).nullable()
    table.integer('colour', 11).defaultTo(9)
    table.integer('password', 11).nullable()
    table.string('sub', 64).nullable()
    table.string('full_name', 64).nullable()
    table.string('email', 64).nullable()
    table.string('phone', 64).nullable()
    table.integer('image_id', 11).nullable()
    table.string('note', 256).nullable()
    table.integer('is_admin', 1).defaultTo(0)
    table.integer('is_current', 1).defaultTo(1)
    table.time('date_created').defaultTo(knex.fn.now())
    table.time('date_modified').defaultTo(knex.fn.now())
    table.integer('is_deleted', 1).defaultTo(0)
  })
}

export async function down(knex): Promise<any> {
  return knex.schema.dropTable('clerk')
}

export async function up(knex): Promise<any> {
  return knex.schema.createTable('distributor_stock', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('artist', 256).nullable()
    table.string('title', 256).nullable()
    table.integer('price', 11).nullable()
    table.string('format', 128).nullable()
    table.string('code', 128).nullable()
    table.string('barcode', 256).nullable()
  })
}

export async function down(knex): Promise<any> {
  return knex.schema.dropTable('distributor_stock')
}

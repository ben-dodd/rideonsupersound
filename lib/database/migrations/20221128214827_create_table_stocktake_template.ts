export async function up(knex): Promise<any> {
  return knex.schema.createTable('stocktake_template', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('name', 256).defaultTo('')
    table.text('filter_description')
    table.string('image', 64).nullable()
    table.integer('format_enabled', 1).nullable()
    table.text('format_list')
    table.integer('vendor_enabled', 1).nullable()
    table.text('vendor_list')
    table.integer('section_enabled', 1).nullable()
    table.text('section_list')
    table.integer('media_enabled', 1).nullable()
    table.text('media_list')
    table.time('last_completed').nullable()
    table.string('status', 64).nullable()
    table.integer('total_estimated', 11).nullable()
    table.integer('total_unique_estimated', 11).nullable()
    table.integer('is_deleted', 1).defaultTo('0')
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('stocktake_template')
}

export const up = function (knex) {
  return knex.schema.createTable('select_option', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('label', 256).nullable()
    table.string('setting_select', 256).nullable()
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('select_option')
}

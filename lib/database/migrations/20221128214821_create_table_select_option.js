exports.up = function (knex, Promise) {
  return knex.schema.createTable('select_option', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('label', 256).nullable()
    table.string('setting_select', 256).nullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('select_option')
}

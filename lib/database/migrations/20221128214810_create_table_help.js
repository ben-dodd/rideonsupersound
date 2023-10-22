export const up = function (knex) {
  return knex.schema.createTable('help', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('title', 256).nullable()
    table.text('tags')
    table.string('pages', 256).defaultTo('')
    table.string('views', 256).defaultTo('')
    table.integer('is_deleted', 1).defaultTo('0')
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('help')
}

export const up = function (knex) {
  return knex.schema.createTable('register_till', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('one_hundred_dollar', 11).nullable()
    table.integer('fifty_dollar', 11).nullable()
    table.integer('twenty_dollar', 11).nullable()
    table.integer('ten_dollar', 11).nullable()
    table.integer('five_dollar', 11).nullable()
    table.integer('two_dollar', 11).nullable()
    table.integer('one_dollar', 11).nullable()
    table.integer('fifty_cent', 11).nullable()
    table.integer('twenty_cent', 11).nullable()
    table.integer('ten_cent', 11).nullable()
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('register_till')
}

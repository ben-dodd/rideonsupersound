exports.up = function (knex, Promise) {
  return knex.schema.createTable('account_clerk', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('account_id', 11).nullable()
    table.integer('clerk_id', 11).nullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('account_clerk')
}

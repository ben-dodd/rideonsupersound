exports.up = function (knex) {
  return knex.schema.createTable('account_clerk', function (table) {
    table.increments('id').unsigned().notNullable()
    table.integer('account_id', 11).nullable()
    table.integer('clerk_id', 11).nullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('account_clerk')
}

export async function up(knex): Promise<any> {
  return knex.schema.createTable('task', function (table) {
    table.increments('id').unsigned().notNullable()
    table.string('description', 256).nullable()
    table.time('date_created').nullable()
    table.integer('created_by_clerk_id', 11).nullable()
    table.string('assigned_to', 64).nullable()
    table.integer('assigned_to_clerk_id', 11).nullable()
    table.integer('is_completed', 1).defaultTo('0')
    table.time('date_completed').nullable()
    table.integer('completed_by_clerk_id', 11).nullable()
    table.integer('is_priority', 1).defaultTo('0')
    table.integer('is_post_mail_order', 1).defaultTo('0')
    table.integer('is_deleted', 1).defaultTo('0')
  })
}

export const down = function (knex) {
  return knex.schema.dropTable('task')
}

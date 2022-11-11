import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('vendor', (table) => {
    table.timestamps(true, true)
    table.increments('id').unsigned()
    table.string('name')
    table.string('vendor_category')
    table.integer('clerk_id').unsigned().references('clerk.id')
    table.string('bank_account_number')
    table.string('contact_name')
    table.string('email')
    table.string('phone')
    table.string('postal_address')
    table.string('note')
    table.timestamp('last_contacted')
    table.tinyint('store_credit_only').unsigned().defaultTo(0)
    table.tinyint('email_vendor').unsigned().defaultTo(1)
    table.string('uid').comment("Uid used to access the vendor's web page")
    table.tinyint('is_deleted').unsigned().defaultTo(0)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('vendor')
}

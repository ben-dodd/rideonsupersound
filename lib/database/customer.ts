import connection from './conn'
import { js2mysql } from './utils/helpers'

export function dbGetCustomers(db = connection) {
  return db('customer').where(`is_deleted`, 0)
}

export function dbGetCustomer(id, db = connection) {
  return db(`customer`).where({ id }).first()
}

export function dbUpdateCustomer(update, id, db = connection) {
  return db(`customer`).where({ id }).update(js2mysql(update))
}

export function dbCreateCustomer(customer, db = connection) {
  return db('customer')
    .insert(js2mysql(customer))
    .then((rows) => rows[0])
}

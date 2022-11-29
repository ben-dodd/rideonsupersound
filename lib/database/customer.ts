import connection from './conn'

export function dbGetCustomers(db = connection) {
  return db('customer').where(`is_deleted`, 0)
}

export function dbCreateCustomer(customer, db = connection) {
  return db('customer').insert(customer)
}

import connection from './conn'

export function dbGetClerk(sub, db = connection) {
  return db('clerk').where({ sub }).first()
}

export function dbGetClerks(db = connection) {
  return db('clerk').where(`is_deleted`, 0)
}

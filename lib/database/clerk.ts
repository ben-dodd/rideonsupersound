import connection from './conn'

export function dbGetClerk(sub, db = connection) {
  return db('clerk').where({ sub }).first()
}

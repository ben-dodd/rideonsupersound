import connection from './utils/conn'

export function getClerk(sub, db = connection) {
  return db('clerk').where({ sub }).first()
}

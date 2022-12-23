import connection from './conn'

export function dbGetHelps(db = connection) {
  return db('help').where({ is_deleted: 0 })
}

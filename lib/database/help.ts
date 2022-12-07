import connection from './conn'

export function dbGetHelp(db = connection) {
  return db('help').where({ is_deleted: 0 })
}

import connection from './conn'

export function dbGetLogs(limit?, db = connection) {
  return db('log')
    .where({ is_deleted: 0 })
    .andWhereNot({ table_id: 'system' })
    .orderBy('date_created', 'desc')
    .limit(limit || 500)
}

export function dbCreateLog(log, db = connection) {
  return db('log').insert(log)
}

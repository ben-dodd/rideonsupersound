import connection from './conn'

export function dbGetLogs(limit = 50, db = connection) {
  return db('log')
    .leftJoin('clerk', 'clerk.id', 'log.clerk_id')
    .select('log.*', 'clerk.name as clerk_name')
    .where('log.is_deleted', 0)
    .andWhereNot('log.table_id', 'system')
    .orderBy('log.date_created', 'desc')
    .limit(limit)
}

export function dbCreateLog(log, db = connection) {
  return db('log').insert(log)
}

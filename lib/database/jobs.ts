import connection from './conn'

export function dbGetJobsToDo(db = connection) {
  return db('task')
    .select('id')
    .where('is_completed', 0)
    .andWhere('is_deleted', 0)
}

export function dbGetJobs(db = connection) {
  return db('task').where(`is_deleted`, 0)
}

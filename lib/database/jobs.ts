import connection from './conn'
import { js2mysql } from './utils/helpers'

export function dbGetJobsToDo(db = connection) {
  return db('task').select('id').where('is_completed', 0).andWhere('is_deleted', 0)
}

export function dbGetJobs(db = connection) {
  return db('task').where(`is_deleted`, 0)
}

export function dbCreateJob(job, db = connection) {
  return db('task').insert(job)
}

export function dbUpdateJob(update, id, db = connection) {
  return db('task').where({ id }).update(js2mysql(update))
}

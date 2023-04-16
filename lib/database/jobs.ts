import connection from './conn'
import { js2mysql } from './utils/helpers'

export function dbGetJobsToDo(db = connection) {
  return db('task').select('id').where('is_completed', 0).andWhere('is_deleted', 0)
}

export function dbGetJobs(db = connection) {
  return db('task').where(`is_deleted`, 0)
}

export function dbCreateJob(job, db = connection) {
  console.log('creating job', js2mysql(job))
  return db('task')
    .insert(js2mysql(job))
    .then((rows) => {
      console.log(rows)
      return rows[0]
    })
}

export function dbUpdateJob(update, id, db = connection) {
  return db('task').where({ id }).update(js2mysql(update))
}

export function dbGetJobsLike(desc, db = connection) {
  return db('task').where('description', 'like', `${desc}%`)
}

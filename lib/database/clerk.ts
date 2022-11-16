import connection from './conn'

export function getClerk(sub, db = connection) {
  return db('clerk').where({ sub })
}

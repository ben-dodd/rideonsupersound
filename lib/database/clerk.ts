import connection from './conn'

export function getClerk(sub, db = connection) {
  console.log('calling get clerk')
  return db('clerk').where({ sub }).first()
}

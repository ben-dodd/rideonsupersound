import connection from './conn'

export function deleteVendor(id, db = connection) {
  return db('vendor').del().where({ id })
}

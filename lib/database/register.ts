import connection from './conn'
import { js2mysql } from './utils/helpers'

export function dbGetRegister(id, db = connection) {
  return db('register').where({ id }).first()
}

export function dbGetRegisters(db = connection) {
  return db('register').where(`is_deleted`, 0)
}

export function dbUpdateRegister(register, id, db = connection) {
  const insertData = js2mysql(register)
  return db('register').where({ id }).update(insertData)
}

export function dbGetCurrentRegister(db = connection) {
  return db('register')
    .join('global', `register.id`, `global.current_register`)
    .select(`register.*`)
    .first()
}

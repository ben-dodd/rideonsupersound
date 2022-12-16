import dayjs from 'dayjs'
import { RegisterObject, TillObject, VendorPaymentTypes } from 'lib/types'
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

export function dbGetCurrentRegisterId(db = connection) {
  return db('global')
    .where(`id`, `current_register`)
    .first()
    .then((id) => id?.num)
}

export function dbGetCurrentRegister(db = connection) {
  return dbGetCurrentRegisterId(db).then(async (register_id) => {
    const register = await db('register').where(`id`, register_id).first()
    const cashGiven = await db('sale_transaction')
      .select(
        'sale_id',
        'clerk_id',
        'date',
        'payment_method',
        'amount',
        'change_given'
      )
      .where({ register_id })
      .where(`is_deleted`, 0)
      .whereNotNull(`change_given`)
    const cashReceived = await db('sale_transaction')
      .select(
        'sale_id',
        'clerk_id',
        'date',
        'payment_method',
        'amount',
        'cash_received'
      )
      .where({ register_id })
      .where(`is_deleted`, 0)
      .whereNotNull(`cash_received`)
    const manualPayments = await db('vendor_payment')
      .select('date', 'amount', 'clerk_id', 'vendor_id')
      .where({ register_id })
      .where(`type`, VendorPaymentTypes.Cash)
    const pettyCash = await db('register_petty_cash').where({ register_id })
    return { ...register, cashGiven, cashReceived, manualPayments, pettyCash }
  })
}

export function dbCreateTill(till, db = connection) {
  return db('register_till').insert(js2mysql(till))
}

export function dbCreateRegister(register, db = connection) {
  return db('register').insert(js2mysql(register))
}

export function dbCreatePettyCash(pettyCash, db = connection) {
  return db('register_petty_cash').insert(js2mysql(pettyCash))
}

export function dbSetRegister(id, db = connection) {
  return db('global').where({ id: 'current_register' }).update({ num: id })
}

export async function dbCloseRegister(
  id: number,
  register: RegisterObject,
  till: TillObject,
  db = connection
) {
  const trx = await knex.transaction()
  try {
    const tillID = await dbCreateTill(till, db)
    dbUpdateRegister(id, {
      closeTillId: tillID,
      closeDate: dayjs.utc().format(),
    })
    dbSetRegister(0, db)
    trx.commit()
  } catch (err) {
    // Roll back the transaction on error
    trx.rollback()
  }
}

export async function dbOpenRegister(
  register: RegisterObject,
  till: TillObject,
  db = connection
) {
  const trx = await knex.transaction()
  try {
    const tillID = await dbCreateTill(till, db)
    const registerId = await dbCreateRegister(
      {
        ...register,
        openTillId: tillID,
        openDate: dayjs.utc().format(),
      },
      db
    )
    // logOpenRegister(clerk, null, registerId)
    dbSetRegister(registerId, db)
    trx.commit()
  } catch (err) {
    // Roll back the transaction on error
    trx.rollback()
  }
}

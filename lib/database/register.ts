import { VendorPaymentTypes } from 'lib/types'
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
  return db('global')
    .where(`id`, `current_register`)
    .first()
    .then((id) => db('register').where(`id`, id?.num).first())
}

export function dbGetCashUp(db = connection) {
  return db('global')
    .where(`id`, `current_register`)
    .first()
    .then(async (id) => {
      const register_id = id?.num
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

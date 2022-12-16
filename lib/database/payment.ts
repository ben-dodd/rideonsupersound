import connection from './conn'
import { js2mysql } from './utils/helpers'
import { dbGetVendorIdFromUid } from './vendor'

export function dbGetAllVendorPayments(db = connection) {
  return db('vendor_payment').where(`is_deleted`, 0)
}

export function dbGetVendorPaymentsByVendorId(vendorId, db = connection) {
  return db('vendor_payment')
    .select('date', 'amount')
    .where({ vendor_id: vendorId })
    .andWhere(`is_deleted`, 0)
}

export function dbGetVendorPaymentsByVendorUid(vendorUid, db = connection) {
  return dbGetVendorIdFromUid(vendorUid).then((vendorId) =>
    db('vendor_payment')
      .where({ vendor_id: vendorId })
      .andWhere(`is_deleted`, 0)
      .orderBy('date', 'desc')
  )
}

export function dbCreateVendorPayment(payment, db = connection) {
  return db('vendor_payment').insert(js2mysql(payment))
}

export function dbUpdateVendorPayment(id, update, db = connection) {
  return db('vendor_payment').where({ id }).update(js2mysql(update))
}

export function dbGetVendorStoreCreditByVendorUid(vendorUid, db = connection) {
  return null
  // return dbGetVendorIdFromUid(vendorUid).then(vendorId => db('sale'))
  // return {
  //   table: 'sale',
  //   columns: 'item_list',
  //   innerJoin: [{}],
  // }
}

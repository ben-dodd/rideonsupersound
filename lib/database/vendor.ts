import { VendorObject } from 'lib/types'
import connection from './conn'
import { js2mysql } from './utils/helpers'

const fullVendorQuery = (db) =>
  db('vendor').select(
    'id',
    'name',
    'vendor_category as vendorCategory',
    'clerk_id as clerkId',
    'bank_account_number as bankAccountNumber',
    'contact_name as contactName',
    'email',
    'phone',
    'postal_address as postalAddress',
    'note',
    'last_contacted as lastContacted',
    'store_credit_only as storeCreditOnly',
    'email_vendor as emailVendor',
    'date_created as dateCreated',
    'date_modified as dateModified',
    'uid'
  )

export function dbCreateVendor(vendor: VendorObject, db = connection) {
  const insertData = prepareItemForDatabase(vendor)
  return db.insert(insertData).into('vendor')
}

export function dbGetVendors(db = connection) {
  return db('vendor')
    .select(
      'id',
      'name',
      'vendor_category as vendorCategory',
      'clerk_id as clerkId',
      'bank_account_number as bankAccountNumber',
      'contact_name as contactName',
      'email',
      'phone',
      'last_contacted as lastContacted',
      'store_credit_only as storeCreditOnly',
      'email_vendor as emailVendor',
      'uid'
    )
    .where({ is_deleted: 0 })
}

export function dbGetVendorNames(db = connection) {
  return db('vendor').select('id', 'name').where({ is_deleted: 0 })
}

export function dbGetVendor(id, db = connection) {
  return fullVendorQuery(db).where({ id }).andWhere({ is_deleted: 0 }).first()
}

export function dbGetVendorByUid(uid, db = connection) {
  return fullVendorQuery(db).where({ uid }).andWhere({ is_deleted: 0 }).first()
}

export function dbGetVendorFromVendorPayment(vendorPaymentId, db = connection) {
  return fullVendorQuery(db)
    .join('vendor_payment', 'vendor_payment.id', vendorPaymentId)
    .first()
}

export function dbUpdateVendor(vendor, id, db = connection) {
  const insertData = js2mysql(vendor)
  return db('vendor').where({ id }).update(insertData)
}

export function dbDeleteVendor(id, db = connection) {
  return db('vendor').del().where({ id })
}

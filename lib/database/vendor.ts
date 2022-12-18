import dayjs from 'dayjs'
import { getCartItemPrice } from 'features/sale/features/sell/lib/functions'
import { VendorObject, VendorPaymentObject } from 'lib/types'
import connection from './conn'
import { dbGetAllVendorPayments } from './payment'
import { dbGetAllSales, dbGetAllSalesAndItems } from './sale'
import { dbGetStockList } from './stock'
import { js2mysql } from './utils/helpers'

const fullVendorQuery = (db) =>
  db('vendor').select(
    'id',
    'name',
    'vendor_category',
    'clerk_id',
    'bank_account_number',
    'contact_name',
    'email',
    'phone',
    'postal_address',
    'note',
    'last_contacted',
    'store_credit_only',
    'email_vendor',
    'date_created',
    'date_modified',
    'uid'
  )

export function dbCreateVendor(vendor: VendorObject, db = connection) {
  return db('vendor').insert(js2mysql(vendor))
}

export function dbGetVendors(db = connection) {
  return db('vendor')
    .select(
      'id',
      'name',
      'vendor_category',
      'clerk_id',
      'bank_account_number',
      'contact_name',
      'email',
      'phone',
      'last_contacted',
      'store_credit_only',
      'email_vendor as emailVendor',
      'uid'
    )
    .where({ is_deleted: 0 })
}

export function dbGetVendorNames(db = connection) {
  return db('vendor').select('id', 'name').where({ is_deleted: 0 })
}

export function dbGetVendor(id, db = connection) {
  return fullVendorQuery(db)
    .where({ id })
    .first()
    .then(async (vendor) => {
      // Get lists
      const items = await dbGetStockList(db).where({ vendor_id: id })
      const sales = await dbGetAllSalesAndItems(db).where(`stock.vendor_id`, id)
      const payments = await dbGetAllVendorPayments(db).where(`vendor_id`, id)

      // Do calculations
      const totalPaid = payments.reduce(
        (acc: number, payment: VendorPaymentObject) => acc + payment?.amount,
        0
      )
      const totalStoreCut = sales
        ?.filter((s) => !s?.isRefunded)
        ?.reduce((acc, saleItem) => {
          const stockItem = items?.find((item) => item?.id === saleItem?.itemId)
          const { storePrice } = getCartItemPrice(saleItem, stockItem)
          return acc + storePrice
        })
      const totalSell = sales
        ?.filter((s) => !s?.isRefunded)
        ?.reduce((acc, saleItem) => {
          const stockItem = items?.find((item) => item?.id === saleItem?.itemId)
          const { totalPrice } = getCartItemPrice(saleItem, stockItem)
          return acc + totalPrice
        })
      const lastPaid = dayjs.max(payments?.map((p) => p?.date))
      const lastSold = dayjs.max(sales?.map((s) => s?.dateSaleClosed))
      const totalOwing = totalSell - totalPaid

      // Return object
      return {
        ...vendor,
        items,
        sales,
        payments,
        totalPaid,
        totalStoreCut,
        totalSell,
        totalOwing,
        lastPaid,
        lastSold,
      }
    })
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

export function dbGetVendorIdFromUid(vendorUid, db = connection) {
  return db('vendor')
    .select('id')
    .where({ uid: vendorUid })
    .first()
    .then((vendor) => vendor?.id)
}

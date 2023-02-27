import connection from './conn'
import dayjs from 'dayjs'
import { getCartItemStoreCut, getCartItemTotal } from 'lib/functions/sell'
import { VendorObject, VendorPaymentObject } from 'lib/types/vendor'
import { dbGetAllVendorPayments } from './payment'
import { dbGetAllSalesAndItems } from './sale'
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
    'uid',
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
      'uid',
    )
    .where({ is_deleted: 0 })
    .orderBy('name')
}

export function dbGetVendorNames(db = connection) {
  return db('vendor').select('id', 'name').where({ is_deleted: 0 })
}

export function dbGetVendorAccounts(db = connection) {
  return dbGetVendorNames(db).then((vendors) =>
    Promise.all(vendors?.map(async (vendor) => await dbGetVendorAccount(vendor, db))),
  )
}

export async function dbGetVendorAccount(vendor, db = connection) {
  const totalVendorPayments = await dbGetTotalVendorPayments(vendor?.id, db)
  const totalVendorCut = await dbGetTotalVendorCut(vendor?.id, db)
  return {
    id: vendor?.id,
    name: vendor?.name,
    totalOwing: totalVendorCut - totalVendorPayments,
  }
}

export function dbGetTotalVendorPayments(vendor_id, db = connection) {
  return db('vendor_payment')
    .sum('amount as totalAmount')
    .where({ vendor_id })
    .where({ is_deleted: 0 })
    .then((res) => res[0].totalAmount)
}

export function dbGetVendorStockIds(vendor_id, db = connection) {
  return db('stock')
    .select('id')
    .where({ vendor_id })
    .where({ is_deleted: 0 })
    .then((stock) => stock?.map((stock) => stock?.id))
}

export function dbGetTotalVendorCutFromVendorStockIds(stockIds, db = connection) {
  return db('sale_item')
    .join('sale', 'sale.id', 'sale_item.sale_id')
    .join('stock_price', 'stock_price.stock_id', 'sale_item.item_id')
    .select(
      'sale_item.quantity',
      'stock_price.vendor_cut',
      'sale_item.vendor_discount',
      `stock_price.date_valid_from`,
      'sale.date_sale_opened',
    )
    .whereIn('sale_item.item_id', stockIds)
    .where('sale_item.is_refunded', 0)
    .where('sale_item.is_deleted', 0)
    .where('sale.state', 'completed')
    .where(`sale.is_deleted`, 0)
    .whereRaw(
      `stock_price.id = (
              SELECT MAX(id) FROM stock_price WHERE stock_id = sale_item.item_id AND date_valid_from <= sale.date_sale_opened
              )`,
    )
    .then((sales) => {
      return sales?.reduce(
        (acc, sale) => acc + (sale?.quantity * sale?.vendor_cut * (100 - (sale?.vendor_discount || 0))) / 100,
        0,
      )
    })
}

export function dbGetTotalVendorCut(vendor_id, db = connection) {
  return dbGetVendorStockIds(vendor_id, db)
    .then((stockIds) => dbGetTotalVendorCutFromVendorStockIds(stockIds, db))
    .catch((e) => Error(e.message))
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
      const totalPaid = payments.reduce((acc: number, payment: VendorPaymentObject) => acc + payment?.amount, 0)
      const totalStoreCut = sales
        ?.filter((s) => !s?.isRefunded)
        ?.reduce((acc, saleItem) => {
          const stockItem = items?.find((item) => item?.id === saleItem?.itemId)
          const { totalSell = 0, vendorCut = 0 } = stockItem
          const price = { totalSell, vendorCut }
          const storePrice = getCartItemStoreCut(saleItem, price)
          return acc + storePrice
        })
      const totalSell = sales
        ?.filter((s) => !s?.isRefunded)
        ?.reduce((acc, saleItem) => {
          const stockItem = items?.find((item) => item?.id === saleItem?.itemId)
          const { totalSell = 0, vendorCut = 0 } = stockItem
          const price = { totalSell, vendorCut }
          const totalPrice = getCartItemTotal(saleItem, stockItem, price)
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
  return db('vendor_payment')
    .leftJoin('vendor', 'vendor.id', 'vendor_payment.vendor_id')
    .select('vendor.id', 'vendor.name')
    .where('vendor_payment.id', vendorPaymentId)
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

export function dbCreateVendorPayment(payment: VendorPaymentObject, db = connection) {
  return db('vendor_payment').insert(js2mysql(payment))
}

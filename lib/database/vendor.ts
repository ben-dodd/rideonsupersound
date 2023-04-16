import connection from './conn'
import dayjs from 'dayjs'
import { getCartItemStoreCut, getCartItemTotal, getDiscountedPrice } from 'lib/functions/sell'
import { VendorObject, VendorPaymentObject } from 'lib/types/vendor'
import { dbGetAllVendorPayments } from './payment'
import { dbGetAllSalesAndItems } from './sale'
import { dbGetSimpleStockCount, dbGetStockItemsForVendor } from './stock'
import { js2mysql } from './utils/helpers'
import { modulusCheck } from 'lib/functions/payment'
import { dollarsToCents } from 'lib/utils'

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
  return db('vendor')
    .insert(js2mysql(vendor))
    .then((rows) => rows[0])
    .catch((e) => {
      console.log(e)
      Error(e.message)
    })
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
      'email_vendor',
      'uid',
    )
    .where({ is_deleted: 0 })
    .orderBy('name')
}

export function dbGetVendorNames(db = connection) {
  return db('vendor').select('id', 'name').where({ is_deleted: 0 })
}

export function dbGetVendorAccounts(db = connection) {
  return db('vendor')
    .select('id', 'uid', 'name', 'email', 'last_contacted', 'bank_account_number', 'store_credit_only', 'email_vendor')
    .where({ is_deleted: 0 })
    .then((vendors) => Promise.all(vendors?.map(async (vendor) => await dbGetVendorAccount(vendor, db))))
}

export async function dbGetVendorAccount(vendor, db = connection) {
  const totalVendorPayments = await dbGetTotalVendorPayments(vendor?.id, db)
  const totalVendorCut = await dbGetTotalVendorCut(vendor?.id, db)
  const lastPaid = await dbGetVendorLastPaid(vendor?.id, db)
  const lastSold = await dbGetVendorLastSold(vendor?.id, db)
  const hasNegativeQuantityItems = await dbGetVendorHasNegativeQuantityItems(vendor?.id, db)
  return {
    ...vendor,
    totalVendorCut,
    totalVendorPayments,
    totalOwing: totalVendorCut - totalVendorPayments,
    lastPaid,
    lastSold,
    hasNegativeQuantityItems,
  }
}

export function dbGetTotalVendorPayments(vendor_id, db = connection) {
  return db('vendor_payment')
    .sum('amount as totalAmount')
    .where({ vendor_id })
    .where({ is_deleted: 0 })
    .then((res) => res[0].totalAmount)
}

export function dbGetVendorLastPaid(vendor_id, db = connection) {
  return db('vendor_payment')
    .select('date')
    .where({ vendor_id })
    .where({ is_deleted: 0 })
    .orderBy('id', 'desc')
    .first()
    .then((rows) => rows?.date || null)
}

export function dbGetVendorLastSold(vendor_id, db = connection) {
  return db('stock')
    .leftJoin('stock_movement', 'stock_movement.stock_id', 'stock.id')
    .select('stock_movement.date_moved')
    .where('stock.vendor_id', vendor_id)
    .where('stock_movement.is_deleted', 0)
    .orderBy('stock_movement.id', 'desc')
    .first()
    .then((rows) => rows?.date_moved || null)
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
        (acc, sale) => acc + getDiscountedPrice(sale?.vendor_cut, sale?.vendor_discount, sale?.quantity),
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
      const items = await dbGetStockItemsForVendor(id, db)
      const sales = await dbGetAllSalesAndItems(db).where(`stock.vendor_id`, id)
      const payments = await dbGetAllVendorPayments(db).where(`vendor_id`, id)

      // Do calculations
      const totalPaid = payments.reduce((acc: number, payment: VendorPaymentObject) => acc + payment?.amount, 0)
      const totalStoreCut = sales
        ?.filter((s) => !s?.is_refunded)
        ?.reduce((acc, saleItem) => {
          const price = { storeCut: saleItem?.sale_store_cut }
          const cartItem = { storeDiscount: saleItem?.store_discount, quantity: saleItem?.quantity }
          const storePrice = getCartItemStoreCut(cartItem, price)
          return acc + storePrice
        }, 0)
      const totalSell = sales
        ?.filter((s) => !s?.is_refunded)
        ?.reduce((acc, saleItem) => {
          const stockItem = {} // actual stock item not required as it will never be a gift card or misc item for a vendor
          const cartItem = {
            vendorDiscount: saleItem?.vendor_discount,
            storeDiscount: saleItem?.store_discount,
            quantity: saleItem?.quantity,
          }
          const price = { totalSell: saleItem?.item_total_sell, vendorCut: saleItem?.item_vendor_cut }
          const totalPrice = getCartItemTotal(cartItem, stockItem, price)
          return acc + totalPrice
        }, 0)
      // console.log(payments)
      const lastPaid = dayjs.max(payments?.map((p) => dayjs(p?.date)))
      // console.log(sales)
      const lastSold = dayjs.max(sales?.filter((s) => s?.date_sale_closed)?.map((s) => dayjs(s?.date_sale_closed)))
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

export function dbCreateBatchVendorPayments(batchPayment, db = connection) {
  return db.transaction(async (trx) => {
    const { vendorList = [], clerkId, registerId, emailed = false } = batchPayment || {}
    const successfulPayments = []
    vendorList
      ?.filter((vendor) => vendor?.isChecked)
      .forEach(async (vendor) => {
        const vendorId = vendor?.id
        if (emailed) {
          await dbUpdateVendor({ lastUpdated: dayjs.utc().format() }, vendorId, trx)
        }
        if (modulusCheck(vendor?.bankAccountNumber) && parseFloat(vendor?.payAmount)) {
          const amount = dollarsToCents(vendor?.payment)
          const paymentId = await dbCreateVendorPayment(
            {
              amount,
              date: dayjs.utc().format(),
              bankAccountNumber: vendor?.bankAccountNumber,
              batchNumber: `${registerId}`,
              sequenceNumber: 'Batch',
              clerkId,
              vendorId,
              registerId,
              type: 'batch',
            },
            trx,
          )
          successfulPayments.push({ paymentId, vendorId, name: vendor?.name, amount })
        }
      })
    return successfulPayments
  })
}

export function dbGetVendorHasNegativeQuantityItems(vendor_id, db = connection) {
  return dbGetSimpleStockCount(db)
    .where({ vendor_id })
    .then((dataRows) => dataRows?.filter((stock) => stock?.quantity < 0)?.length > 0)
}

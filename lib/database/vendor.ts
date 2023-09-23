import connection from './conn'
import dayjs from 'dayjs'
import { getCartItemStoreCut, getCartItemTotal, getDiscountedPrice } from 'lib/functions/sell'
import { BatchPaymentObject, VendorObject, VendorPaymentObject } from 'lib/types/vendor'
import { dbGetAllVendorPayments } from './payment'
import { dbGetAllSalesAndItems } from './sale'
import { dbGetSimpleStockCount, dbGetStockItemsForVendor } from './stock'
import { js2mysql } from './utils/helpers'
import { dollarsToCents } from 'lib/utils'
import { modulusCheck, prepareKiwiBankBatchFile, preparePaymentNotificationEmailList } from 'lib/functions/payment'

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
      const lastPaid = dayjs.max(payments?.map((p) => dayjs(p?.date)))
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
  return db('vendor_payment')
    .insert(js2mysql(payment))
    .then((rows) => rows[0])
}

export function dbUpdateVendorPayment(update, id, db = connection) {
  return db('vendor_payment').where({ id }).update(js2mysql(update))
}

export function dbCreateBatchPayment(batchPayment: BatchPaymentObject, db = connection) {
  return db('batch_payment')
    .insert(js2mysql(batchPayment))
    .then((rows) => rows[0])
    .catch((e) => Error(e.message))
}

export function dbUpdateBatchPayment(batchPayment: BatchPaymentObject, id: number, db = connection) {
  return db('batch_payment')
    .where({ id })
    .update(js2mysql(batchPayment))
    .then((id) => id)
    .catch((e) => Error(e.message))
}

export function dbCheckBatchPaymentInProgress(db = connection) {
  return db('batch_payment').select('id').whereIsNull('date_completed').first()
}

export async function dbSaveBatchVendorPayment(batchPayment, db = connection) {
  const savedBatchPayment = {
    ...batchPayment,
    paymentList: batchPayment?.paymentList?.filter((payment) => payment?.isChecked),
  }

  return db.transaction(async (trx) => {
    let batchId = savedBatchPayment?.id
    const { paymentList = [] } = savedBatchPayment || []

    if (batchId) {
      await dbUpdateBatchPayment({ ...savedBatchPayment, paymentList: JSON.stringify(paymentList) }, batchId, trx)
    } else {
      batchId = await dbCreateBatchPayment({ ...savedBatchPayment, paymentList: JSON.stringify(paymentList) }, trx)
    }
    const paymentCompleted = savedBatchPayment?.dateCompleted

    if (paymentCompleted) {
      let newPaymentList = []
      const promises = []

      paymentList
        ?.filter((payment) => payment?.isChecked)
        .forEach((payment) => {
          if (modulusCheck(payment?.bankAccountNumber) && parseFloat(payment?.payAmount)) {
            const amount = dollarsToCents(payment?.payAmount)
            const vendorPayment = {
              amount,
              date: dayjs.utc().format(),
              bankAccountNumber: payment?.bankAccountNumber,
              batchId,
              clerkId: batchPayment?.clerkId,
              vendorId: payment?.vendorId,
              registerId: batchPayment?.registerId,
              type: 'batch',
            }
            const promise = dbCreateVendorPayment(vendorPayment, trx).then((paymentId) => {
              newPaymentList.push({ ...payment, id: paymentId })
            })
            promises.push(promise)
          }
        })

      await Promise.all(promises)

      const kbbFile = prepareKiwiBankBatchFile(batchId, newPaymentList)
      const emailCsvFile = preparePaymentNotificationEmailList(newPaymentList)

      await dbUpdateBatchPayment(
        {
          paymentList: JSON.stringify(newPaymentList),
          kbbFile,
          emailCsvFile,
        },
        batchId,
        trx,
      )
    }

    return dbGetBatchVendorPayment(batchId, trx)
  })
}

export async function dbDeleteBatchPayment(batchId, db = connection) {
  return db.transaction(async (trx) => {
    await dbUpdateBatchPayment({ isDeleted: true }, batchId, trx)
    await trx('vendor_payment').update({ is_deleted: true }).where({ batch_id: batchId })
  })
}

export async function dbDeleteVendorPayment(id, db = connection) {
  return db('vendor_payment').update({ is_deleted: true }).where({ id })
}

export function dbGetVendorHasNegativeQuantityItems(vendor_id, db = connection) {
  return dbGetSimpleStockCount(db)
    .where({ vendor_id })
    .then((dataRows) => dataRows?.filter((stock) => stock?.quantity < 0)?.length > 0)
}

export function dbGetBatchVendorPayments(db = connection) {
  return db('batch_payment')
    .where('batch_payment.is_deleted', false)
    .leftJoin('clerk as startedByClerk', 'startedByClerk.id', 'batch_payment.started_by_clerk_id')
    .leftJoin('clerk as completedByClerk', 'completedByClerk.id', 'batch_payment.completed_by_clerk_id')
    .select(
      'batch_payment.*',
      'startedByClerk.name as startedByClerkName',
      'completedByClerk.name as completedByClerkName',
    )
    .orderBy('date_completed', 'desc')
    .orderBy('id', 'desc')
}

export function dbGetBatchVendorPayment(id, db = connection) {
  return db('batch_payment')
    .where({ id, is_deleted: false })
    .first()
    .then((batchPayment) => {
      return { ...batchPayment, payment_list: JSON.parse(batchPayment?.payment_list || '[]') }
    })
}

export function dbGetCurrentVendorBatchPaymentId(db = connection) {
  return db('batch_payment')
    .select('id')
    .where({ is_deleted: 0 })
    .where({ date_completed: null })
    .first()
    .then((payment) => payment?.id)
}

export function dbGetVendorPaymentsByBatchId(batchId, db = connection) {
  return db('vendor_payment').where({ batch_id: batchId, is_deleted: 0 })
}

export function dbGetVendorPayment(paymentId, db = connection) {
  return db('vendor_payment').where({ id: paymentId, is_deleted: 0 })
}

export function dbGetVendorPayments(db = connection) {
  return db('vendor_payment')
    .where('vendor_payment.is_deleted', 0)
    .leftJoin('vendor', 'vendor.id', 'vendor_payment.vendor_id')
    .leftJoin('clerk', 'clerk.id', 'vendor_payment.clerk_id')
    .select('vendor_payment.*', 'clerk.name as clerkName', 'vendor.name as vendorName')
    .orderBy('id', 'desc')
}

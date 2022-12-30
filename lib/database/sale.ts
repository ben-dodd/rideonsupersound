import connection from './conn'
import dayjs from 'dayjs'
import { RoleTypes } from 'lib/types'
import { PaymentMethodTypes, SaleStateTypes } from 'lib/types/sale'
import { StockMovementTypes } from 'lib/types/stock'
import { VendorPaymentTypes } from 'lib/types/vendor'
import { dbGetCustomer } from './customer'
import { dbCreateJob } from './jobs'
import { dbCreateVendorPayment, dbUpdateVendorPayment } from './payment'
import { dbCheckIfRestockNeeded, dbCreateStockItem, dbCreateStockMovement, dbUpdateStockItem } from './stock'
import { js2mysql } from './utils/helpers'

export function dbGetAllSales(db = connection) {
  return db('sale')
    .select(
      'id',
      'customer_id',
      'state',
      'date_sale_opened',
      'sale_opened_by',
      'date_sale_closed',
      'sale_closed_by',
      'store_cut',
      'total_price',
      'number_of_items',
      'item_list',
      'is_mail_order',
      'postage',
      'postal_address',
      'weather',
      'note',
    )
    .where(`is_deleted`, 0)
}

export function dbGetAllSalesAndItems(db = connection) {
  return db('sale_item')
    .join('stock', 'sale_item.item_id', 'stock.id')
    .join('sale', 'sale.id', 'sale_item.sale_id')
    .join('stock_price', 'stock_price.stock_id', 'sale_item.item_id')
    .select(
      'sale_item.id',
      'sale_item.sale_id',
      'sale_item.item_id',
      'sale_item.quantity',
      'sale_item.store_discount',
      'sale_item.vendor_discount',
      'sale_item.is_refunded',
      'stock.vendor_id',
      'stock.format',
      'stock.is_gift_card',
      'stock.gift_card_code',
      'stock.is_misc_item',
      'stock.misc_item_description',
      'stock.display_as',
      'stock.artist',
      'stock.title',
      'sale.date_sale_opened',
      'sale.date_sale_closed',
      'sale.store_cut',
      'sale.total_price',
      'sale.number_of_items',
      'sale.item_list',
      'stock_price.vendor_cut',
      'stock_price.total_sell',
      'stock_price.date_valid_from as datePriceValidFrom',
    )
    .where(`stock_price.date_valid_from`, '<=', 'sale.date_sale_opened')
    .andWhereRaw(
      `stock_price.id = (
    SELECT MAX(id) FROM stock_price WHERE stock_id = sale_item.item_id)`,
    )
    .andWhere('sale.state', 'completed')
    .andWhere(`sale.is_deleted`, 0)
    .andWhere(`sale_item.is_deleted`, 0)
}

export function dbGetAllHolds(db = connection) {
  return db('hold').where(`is_deleted`, 0)
}

export function dbGetSale(id, db = connection) {
  return db('sale').where({ id }).first()
}

export function dbGetSaleItemsBySaleId(saleId, db = connection) {
  return db('sale_item').where({ sale_id: saleId })
}

export function getSaleTransactionsBySaleId(saleId, db = connection) {
  return db('sale_transaction').where({ sale_id: saleId })
}

export function getAllSaleItems(db = connection) {
  return db('sale_item')
}

export function dbCreateSale(sale, db = connection) {
  console.log('CREATING SALE...', sale)
  return db('sale')
    .insert(js2mysql(sale))
    .then((rows) => rows[0])
    .catch((e) => Error(e.message))
}

export function dbCreateHold(hold, db = connection) {
  return db('hold')
    .insert(js2mysql(hold))
    .then(() =>
      dbCreateStockMovement(
        {
          stockId: hold?.itemId,
          clerkId: hold?.startedBy,
          quantity: hold?.quantity * -1,
          act: StockMovementTypes.Hold,
        },
        db,
      ),
    )
    .then(() => dbCheckIfRestockNeeded(hold?.itemId, db))
}

export function dbUpdateSale(id, update, db = connection) {
  return db('sale')
    .where({ id })
    .update(js2mysql(update))
    .then(() => id)
    .catch((e) => Error(e.message))
}

export function dbCreateSaleItem(saleItem, db = connection) {
  return db('sale_item')
    .insert(js2mysql(saleItem))
    .then((rows) => rows[0])
    .catch((e) => Error(e.message))
}

export function dbUpdateSaleItem(id, update, db = connection) {
  return db('sale_item')
    .where({ id })
    .update(js2mysql(update))
    .catch((e) => Error(e.message))
}

export function dbDeleteSaleItem(id, db = connection) {
  return dbUpdateSaleItem(id, { isDeleted: true }).catch((e) => Error(e.message))
}

export function dbCreateSaleTransaction(saleTransaction, db = connection) {
  return db('sale_transaction')
    .insert(js2mysql(saleTransaction))
    .catch((e) => Error(e.message))
}

export function dbUpdateSaleTransaction(id, update, db = connection) {
  return db('sale_transaction')
    .where({ id })
    .update(js2mysql(update))
    .catch((e) => Error(e.message))
}

export async function dbSaveCart(cart, prevState, db = connection) {
  return db
    .transaction(async (trx) => {
      const { sale = {}, items = [], transactions = [] } = cart || {}
      const newSale = { ...sale }
      if (newSale?.id) {
        dbUpdateSale(newSale?.id, newSale, trx)
      } else {
        newSale.state = newSale?.state || SaleStateTypes.InProgress
        newSale.id = await dbCreateSale(newSale, trx)
      }
      if (sale?.isMailOrder && sale?.state === SaleStateTypes.Completed) {
        const customer = await dbGetCustomer(sale?.customerId, trx)
        dbCreateJob(
          {
            description: `Post Sale ${sale?.id} (${sale?.itemList}) to ${`${customer?.name}\n` || ''}${
              sale?.postalAddress
            }`,
            createdByClerkId: sale?.saleOpenedBy,
            assignedTo: RoleTypes?.MC,
            dateCreated: dayjs.utc().format(),
            isPostMailOrder: true,
          },
          trx,
        )
      }

      for (const item of items) {
        await handleSaveSaleItem(item, newSale, prevState, trx)
      }

      for (const trans of transactions) {
        await handleSaveSaleTransaction(trans, newSale, trx)
      }
      console.log(newSale)
      return newSale?.id
    })
    .then((id) => {
      return id
    })
    .catch((e) => Error(e.message))
}

export async function dbDeleteSale(id, { sale, clerk, registerID }, db = connection) {
  return db
    .transaction(async (trx) => {
      await sale?.items?.forEach((saleItem) => {
        dbUpdateSaleItem(saleItem?.id, { isDeleted: true }, trx)
        // TODO should this delete the original sale stock movement instead?
        if (!saleItem?.isRefunded)
          dbCreateStockMovement(
            {
              item: saleItem,
              clerk,
              registerID,
              act: StockMovementTypes.Unsold,
              note: 'Sale nuked.',
              saleId: sale?.id,
            },
            trx,
          )
      })
      await sale?.transactions?.forEach((saleTransaction) => {
        if (saleTransaction?.vendorPaymentId)
          dbUpdateVendorPayment(
            saleTransaction?.vendorPaymentId,
            {
              isDeleted: true,
            },
            trx,
          )
        dbUpdateSaleTransaction(saleTransaction?.id, { isDeleted: true }, trx)
      })
      // deleteStockMovementsFromDatabase(sale?.id);
      await dbUpdateSale(id, { isDeleted: true }, trx)
    })
    .then((res) => res)
    .catch((e) => Error(e.message))
}

async function handleSaveSaleItem(item, sale, prevState, db) {
  return db
    .transaction(async (trx) => {
      // If sale is complete, validate gift card
      if (sale?.state === SaleStateTypes.Completed && item?.isGiftCard) {
        await dbUpdateStockItem(item?.itemId, { giftCardIsValid: true }, trx)
      }

      await handleStockMovements(item, sale, prevState, trx)
      dbCheckIfRestockNeeded(item?.itemId, trx)

      let itemId = item?.id

      // Add or update Sale Item
      if (!itemId) {
        // Item is new to sale
        let newSaleItem = { ...item, saleId: sale?.id }
        itemId = await dbCreateSaleItem(newSaleItem, trx)
      } else {
        // Item was already in sale, update in case discount, quantity has changed or item has been deleted
        dbUpdateSaleItem(item?.id, item, db)
      }
      return itemId
    })
    .then((id) => id)
    .catch((e) => Error(e.message))
}

async function handleStockMovements(item, sale, prevState, db) {
  // Add stock movement if it's a regular stock item
  if (!item?.isGiftCard && !item?.isMiscItem) {
    let stockMovement = {
      stockId: item?.itemId,
      clerkId: sale?.saleClosedBy,
      act: StockMovementTypes.Sold,
      quantity: 0,
    }
    if (sale?.state === SaleStateTypes.Completed) {
      // If it was a layby, unlayby it before marking as sold
      if (prevState === SaleStateTypes.Layby && !item?.isGiftCard) {
        stockMovement.act = StockMovementTypes.Unlayby
      }
      if (item?.isRefunded) {
        // Refund item if refunded
        stockMovement.act = StockMovementTypes.Unsold
      }
      // Add layby stock movement if it's a new layby
    } else if (sale?.state === SaleStateTypes.Layby && prevState !== SaleStateTypes.Layby) {
      stockMovement.clerkId = sale?.laybyStartedBy
      stockMovement.act = StockMovementTypes.Layby
    }
    stockMovement.quantity = getStockMovementQuantityByAct(item?.quantity, stockMovement?.act)
    await dbCreateStockMovement(stockMovement, db)
  }
}

export function getStockMovementQuantityByAct(quantity, act) {
  return act === StockMovementTypes.Received ||
    act === StockMovementTypes.Unhold ||
    act === StockMovementTypes.Unlayby ||
    act === StockMovementTypes.Found ||
    act === StockMovementTypes.Unsold ||
    act === StockMovementTypes.Adjustment
    ? parseInt(quantity)
    : -parseInt(quantity)
}

async function handleSaveSaleTransaction(trans, sale, db) {
  if (!trans?.id) {
    // Transaction is new to sale
    let newSaleTransaction = { ...trans, saleId: sale?.id }
    if (trans?.paymentMethod === PaymentMethodTypes.Account) {
      // Add account payment as a store payment to the vendor
      let vendorPaymentId = null
      const vendorPayment = {
        amount: trans?.amount,
        clerkId: trans?.clerkId,
        vendorId: trans?.vendor?.id,
        type: trans?.isRefund ? VendorPaymentTypes.SaleRefund : VendorPaymentTypes.Sale,
        date: dayjs.utc().format(),
        registerId: trans?.registerId,
      }
      vendorPaymentId = await dbCreateVendorPayment(vendorPayment, db)
      newSaleTransaction = { ...trans, vendorPayment: vendorPaymentId }
    }
    let giftCardId = null
    if (trans?.paymentMethod === PaymentMethodTypes.GiftCard) {
      if (!trans?.isRefund) {
        // Gift card is new, create new one
        giftCardId = await dbCreateStockItem(trans?.giftCardUpdate, db)
      } else {
        // Update gift card
        await dbUpdateStockItem(trans?.giftCardUpdate, trans?.giftCardUpdate?.id, db)
      }
    }
    if (giftCardId) newSaleTransaction = { ...newSaleTransaction, giftCardId }
    await dbCreateSaleTransaction(newSaleTransaction, db)
  }
}

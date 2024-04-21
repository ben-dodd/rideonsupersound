import connection from './conn'
import dayjs from 'dayjs'
import { RoleTypes } from 'lib/types'
import { PaymentMethodTypes, SaleStateTypes, SaleTransactionObject } from 'lib/types/sale'
import { StockMovementTypes } from 'lib/types/stock'
import { VendorPaymentTypes } from 'lib/types/vendor'
import { dbGetCustomer } from './customer'
import { dbCreateJob, dbGetJobsLike } from './jobs'
import { dbCreateVendorPayment, dbUpdateVendorPayment } from './payment'
import {
  dbCheckIfRestockNeeded,
  dbCreateStockItem,
  dbCreateStockMovement,
  dbUpdateStockItem,
  dbGetGiftCard,
} from './stock'
import { js2mysql, mysql2js } from 'lib/utils'
import { getItemSkuDisplayName } from 'lib/functions/displayInventory'

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
    )
    .where(`is_deleted`, 0)
    .orderBy('date_sale_opened', 'desc')
}

export function dbGetAllParkedSales(db = connection) {
  return dbGetAllSales(db).where(`state`, SaleStateTypes.Parked)
}

export function dbGetAllLaybys(db = connection) {
  return dbGetAllSales(db).where(`state`, SaleStateTypes.Layby)
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
      'sale.store_cut as sale_store_cut',
      'sale.total_price as sale_total_price',
      'sale.number_of_items',
      'sale.item_list',
      'stock_price.vendor_cut as item_vendor_cut',
      'stock_price.total_sell as item_total_sell',
      'stock_price.date_valid_from as date_price_valid_from',
    )
    .where('sale.state', 'completed')
    .where(`sale.is_deleted`, 0)
    .where(`sale_item.is_deleted`, 0)
    .whereRaw(
      `stock_price.id = (
    SELECT MAX(id) FROM stock_price WHERE stock_id = sale_item.item_id AND stock_price.date_valid_from <= sale.date_sale_opened)`,
    )
}

export function dbGetAllHolds(db = connection) {
  return db('hold')
    .leftJoin('stock', 'stock.id', 'hold.item_id')
    .leftJoin('clerk as open_clerk', 'open_clerk.id', 'hold.started_by')
    .leftJoin('clerk as close_clerk', 'close_clerk.id', 'hold.removed_from_hold_by')
    .leftJoin('customer', 'customer.id', 'hold.customer_id')
    .select(
      'hold.*',
      'customer.name as customer_name',
      'stock.artist as artist',
      'stock.title as title',
      'stock.format as format',
      'stock.vendor_id as vendor_id',
      'open_clerk.name as open_clerk_name',
      'close_clerk.name as close_clerk_name',
    )
    .where(`hold.is_deleted`, 0)
    .orderBy('hold.date_created', 'desc')
}

export function dbGetAllCurrentHolds(db = connection) {
  return dbGetAllHolds(db).where(`hold.date_removed_from_hold`, null)
}

export function dbGetHoldsForItem(itemId, db = connection) {
  return dbGetAllHolds(db).where(`hold.item_id`, itemId).where(`hold.date_removed_from_hold`, null)
}

export async function dbGetSale(id, db = connection) {
  const cart: any = {}
  cart.sale = await db('sale').where({ id }).first()
  if (!cart?.sale) cart.sale = {}
  cart.customer = cart?.sale?.customer_id ? await dbGetCustomer(cart?.sale?.customer_id, db) : null
  cart.items = await dbGetSaleItemsBySaleId(id, db)
  cart.transactions = await dbGetSaleTransactionsBySaleId(id, db)
  return cart
}

export async function dbGetSaleState(id, db = connection) {
  const cart: any = {}
  cart.sale = await db('sale').select('state').where({ id }).first()
  if (!cart?.sale) cart.sale = {}
  cart.items = await dbGetSaleItemsBySaleId(id, db)
  return cart
}

export function dbGetSaleItemsBySaleId(saleId, db = connection) {
  return db('sale_item').where({ sale_id: saleId })
  // .where({ is_deleted: 0 })
}

export function dbGetSaleTransactionsBySaleId(saleId, db = connection) {
  return db('sale_transaction').where({ sale_id: saleId })
}

export function dbGetAllSaleItems(db = connection) {
  return db('sale_item')
}

export function dbCreateSale(sale, db = connection) {
  return db('sale')
    .insert(js2mysql(sale))
    .then((rows) => rows[0])
    .catch((e) => {
      Error(e.message)
    })
}

export function dbCreateHold(hold, db = connection) {
  return db('hold')
    .insert(js2mysql(hold))
    .then((rows) => {
      const holdId = rows[0]
      dbCreateStockMovement(
        {
          stockId: hold?.itemId,
          clerkId: hold?.startedBy,
          quantity: hold?.quantity * -1,
          holdId: holdId,
          act: StockMovementTypes.Hold,
        },
        db,
      )
    })
    .then(() => dbCheckIfRestockNeeded(hold?.itemId, db))
}

export function dbUpdateSale(id, update, db = connection) {
  const newUpdate = { ...update }
  if (newUpdate?.weather) delete newUpdate.weather
  return db('sale')
    .where({ id })
    .update(js2mysql(newUpdate))
    .then(() => {
      return id
    })
    .catch((e) => {
      Error(e.message)
    })
}

export function dbUpdateHold(id, update, db = connection) {
  return db('hold')
    .where({ id })
    .update(js2mysql(update))
    .then(() => {
      return id
    })
    .catch((e) => {
      Error(e.message)
    })
}

export function dbCancelHold(id, clerk, isAddedToCart = false, db = connection) {
  return dbUpdateHold(
    id,
    {
      removedFromHoldBy: clerk?.id,
      dateRemovedFromHold: dayjs.utc().format(),
      isSold: isAddedToCart,
    },
    db,
  )
    .then(() => dbGetAllHolds(db).where('hold.id', id).first())
    .then((hold) => {
      const unholdStockMovement = {
        stockId: hold?.item_id,
        clerkId: clerk?.id,
        quantity: hold?.quantity,
        holdId: hold?.id,
        act: StockMovementTypes.Unhold,
      }
      return dbCreateStockMovement(unholdStockMovement, db).then(
        () =>
          !isAddedToCart &&
          dbCreateJob(
            {
              description: `Return ${getItemSkuDisplayName(hold)} to stock from holds.`,
              createdByClerkId: clerk?.id,
              dateCreated: dayjs.utc().format(),
            },
            db,
          ),
      )
    })
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
  return dbUpdateSaleItem(id, { isDeleted: true }, db).catch((e) => Error(e.message))
}

export function dbDeleteStockMovementForSale(id, db = connection) {
  return db('stock_movement')
    .where({ sale_id: id })
    .update({ is_deleted: 1 })
    .catch((e) => Error(e.message))
}

export function dbDeleteStockMovementForSaleItem(stockId, saleId, db = connection) {
  return db('stock_movement')
    .where({ sale_id: saleId })
    .andWhere({ stock_id: stockId })
    .update({ is_deleted: 1 })
    .catch((e) => Error(e.message))
}

export function dbCreateSaleTransaction(saleTransaction, db = connection) {
  return db('sale_transaction')
    .insert(js2mysql(saleTransaction))
    .then((rows) => rows[0])
    .catch((e) => Error(e.message))
}

export function dbUpdateSaleTransaction(id, update, db = connection) {
  return db('sale_transaction')
    .where({ id })
    .update(js2mysql(update))
    .catch((e) => Error(e.message))
}

export function dbUpdateStockMovement(id, update, db = connection) {
  return db('stock_movement')
    .where({ id })
    .update(js2mysql(update))
    .catch((e) => Error(e.message))
}

export async function dbSaveCart(cart, db = connection) {
  return db
    .transaction(async (trx) => {
      const prevSale = cart?.sale?.id ? await dbGetSaleState(cart?.sale?.id, trx) : null
      const { sale = {}, items = [], transactions = [], registerId = null } = cart || {}
      const newSale = {
        ...sale,
        state: sale?.state || SaleStateTypes.InProgress,
      }

      if (newSale?.id) {
        await dbUpdateSale(newSale?.id, newSale, trx)
      } else {
        newSale.id = await dbCreateSale(newSale, trx)
      }
      if (newSale?.isMailOrder && newSale?.state === SaleStateTypes.Completed) {
        // Check if mail order already exists
        const prevMailOrderJob = await dbGetJobsLike(`Post Sale ${newSale?.id}`, trx).first()
        if (!prevMailOrderJob) {
          const customer = await dbGetCustomer(newSale?.customerId, trx)
          const mailOrderJob = {
            description: `Post Sale ${newSale?.id} (${newSale?.itemList}) to ${`${customer?.name}\n` || ''}${
              newSale?.postalAddress
            }`,
            createdByClerkId: newSale?.saleOpenedBy,
            assignedTo: RoleTypes?.MC,
            dateCreated: dayjs.utc().format(),
            isPostMailOrder: true,
          }
          dbCreateJob(mailOrderJob, trx)
        }
      }

      const promises = []

      for (const item of items) {
        promises.push(handleSaveSaleItem(item, newSale, prevSale, registerId, trx))
      }

      for (const trans of transactions) {
        promises.push(handleSaveSaleTransaction(trans, newSale, trx))
      }

      await Promise.all(promises).catch((e) => console.error(e)) // catch any unhandled promise rejections

      return dbGetSale(newSale?.id, trx)
    })
    .then((cart) => {
      return cart
    })
    .catch((e) => {
      console.error('Transaction failed:', e.message)
      return Error(e.message)
    })
}

export async function dbGetStockMovementsForSaleAndItem(stockId, saleId, db = connection) {
  return db('stock_movement').where('stock_id', '=', stockId).andWhere('sale_id', '=', saleId)
}

export async function dbDeleteSaleTransaction(trans: SaleTransactionObject, db = connection) {
  // If transaction is from a vendor account, remove the vendor account payment from db
  if (trans?.vendorPaymentId) {
    await dbUpdateVendorPayment(
      trans?.vendorPaymentId,
      {
        isDeleted: true,
      },
      db,
    )
  }
  // If transaction is a gift card, undo all gift card actions
  if (trans?.giftCardId) {
    await dbReverseGiftCardTransaction(trans, db)
  }
  await dbUpdateSaleTransaction(trans?.id, { isDeleted: true }, db)
  return true
}

export async function dbReverseGiftCardTransaction(trans: SaleTransactionObject, db = connection) {
  if (trans.isRefund) {
    // If refund, simply invalidate the gift card that was created as the refund
    await dbUpdateStockItem({ giftCardIsValid: false }, trans?.giftCardId, db)
  } else {
    await dbGetGiftCard(trans?.giftCardId, db).then(async (giftCardItem) => {
      const { giftCard = {} } = mysql2js(giftCardItem) || {}
      const newAmount = (giftCard?.giftCardRemaining || 0) + (trans?.changeGiven || 0) + (trans?.amount || 0)
      await dbUpdateStockItem({ giftCardRemaining: newAmount, giftCardIsValid: true }, trans?.giftCardId, db)
    })
  }
}

export async function dbDeleteSale(id, db = connection) {
  return db
    .transaction(async (trx) => {
      await dbGetSale(id, trx).then(async (sqlSale) => {
        const sale = mysql2js(sqlSale)
        if (!sale) {
          throw new Error(`Sale with id ${id} not found.`)
        }
        for (const saleItem of sale.items) {
          if (saleItem?.isMiscItem) {
            await dbUpdateStockItem({ isDeleted: true }, saleItem?.itemId, trx)
          }
          if (saleItem?.isGiftCard) {
            await dbUpdateStockItem({ isDeleted: true, giftCardIsValid: false }, saleItem?.itemId, trx)
          }
          await dbUpdateSaleItem(saleItem?.id, { isDeleted: true }, trx)
        }

        await dbDeleteStockMovementForSale(id, trx)

        for (const saleTransaction of sale.transactions) {
          await dbDeleteSaleTransaction(saleTransaction, trx)
        }

        await dbUpdateSale(id, { isDeleted: true }, trx)
      })
    })
    .then((res) => res)
    .catch((e) => Error(e.message))
}

async function handleSaveSaleItem(item, sale, prevSale, registerId, trx) {
  // return db
  //   .transaction(async (trx) => {
  const newItem = { ...item }
  const { sale: { state: prevState = SaleStateTypes.InProgress } = {}, items = [] } = prevSale || {}
  const prevItem = items?.find((prev) => prev?.id === item?.id)

  // handle gift cards
  if (item?.isGiftCard) {
    if (sale?.state === SaleStateTypes.Completed) {
      // If sale is completed, validate gift card
      await dbUpdateStockItem(item?.itemId, { giftCardIsValid: true }, trx)
    } else if (prevState === SaleStateTypes.Completed && sale?.state !== SaleStateTypes.Completed) {
      // If sale was complete and is now in progress, invalidate gift card
      await dbUpdateStockItem(item?.itemId, { giftCardIsValid: false }, trx)
    }
  }

  await handleStockMovements(item, sale, prevState, prevItem, registerId, trx)
  await dbCheckIfRestockNeeded(item?.itemId, sale?.state, trx)

  // Add or update Sale Item
  if (!item?.id) {
    // Item is new to sale
    let newSaleItem = { ...item, saleId: sale?.id }
    const id = await dbCreateSaleItem(newSaleItem, trx)
    newItem.id = id
  } else {
    // Item was already in sale, update in case discount, quantity has changed or item has been deleted
    dbUpdateSaleItem(item?.id, item, trx)
  }
  return newItem
}

async function handleStockMovements(item, sale, prevState, prevItem, registerId = null, db) {
  // Add stock movement if it's a regular stock item
  if (!item?.isGiftCard && !item?.isMiscItem) {
    const prevStockMovements =
      item?.itemId && sale?.id ? await dbGetStockMovementsForSaleAndItem(item?.itemId, sale?.id, db) : null
    // If item has recently been deleted, delete stock movements for that sale and item
    if (item?.isDeleted) {
      if (!prevItem?.is_deleted) await dbDeleteStockMovementForSaleItem(item?.itemId, sale?.id, db)
    } else {
      let stockMovement = {
        stockId: item?.itemId,
        clerkId: sale?.saleClosedBy,
        saleId: sale?.id,
        registerId,
        act: null,
        quantity: 0,
      }
      if (sale?.state === SaleStateTypes.Completed && prevState === SaleStateTypes.Layby) {
        // Sale has gone from not completed to completed
        // If it was a layby, unlayby it before marking as sold
        const unlaybyQuantity = getStockMovementQuantityByAct(item?.quantity, StockMovementTypes.Unlayby)
        await dbCreateStockMovement(
          { ...stockMovement, act: StockMovementTypes.Unlayby, quantity: unlaybyQuantity },
          db,
        )
      }

      if (item?.isRefunded) {
        if (!prevItem?.is_refunded) {
          // Refund item if refunded
          const refundQuantity = getStockMovementQuantityByAct(item?.quantity, StockMovementTypes.Unsold)
          await dbCreateStockMovement(
            { ...stockMovement, act: StockMovementTypes.Unsold, quantity: refundQuantity },
            db,
          )
        }
      }

      if (sale?.state === SaleStateTypes.Completed || sale?.state === SaleStateTypes.Layby) {
        const act = sale?.state === SaleStateTypes.Completed ? StockMovementTypes.Sold : StockMovementTypes.Layby
        // Add sold or layby record
        const smQuantity = getStockMovementQuantityByAct(item?.quantity, act)
        const prevStockMovement = prevStockMovements?.find((sm) => sm?.act === act)
        if (prevStockMovement) {
          if (prevItem?.is_deleted || prevItem?.is_refunded) {
            // Previous stock item was deleted or refunded, treat as a new item being added
            await dbCreateStockMovement({ ...stockMovement, act, quantity: smQuantity }, db)
          } else if (prevStockMovement?.quantity !== smQuantity) {
            // Stock movement exists, check quantities and adjust if needed
            // Quantity has changed
            dbUpdateStockMovement(prevStockMovement?.id, { quantity: smQuantity }, db)
          }
        } else {
          await dbCreateStockMovement({ ...stockMovement, act, quantity: smQuantity }, db)
        }
      }
    }
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

async function handleSaveSaleTransaction(trans, sale, db = connection) {
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
      delete trans?.vendor
      newSaleTransaction = { ...trans, vendorPaymentId }
    }
    if (trans?.paymentMethod === PaymentMethodTypes.GiftCard) {
      if (trans?.isRefund) {
        // Gift card is new, create new one
        let giftCardId = await dbCreateStockItem(trans?.giftCardUpdate, db)
        newSaleTransaction = { ...newSaleTransaction, giftCardId }
      } else {
        // Update gift card
        await dbUpdateStockItem(trans?.giftCardUpdate, trans?.giftCardUpdate?.id, db)
      }
      delete newSaleTransaction?.giftCardUpdate
    }
    const id = await dbCreateSaleTransaction(newSaleTransaction, db)
    return { ...newSaleTransaction, id }
    // })
    // .then((trans) => trans)
    // .catch((e) => Error(e.message))
  } else if (trans?.isDeleted) {
    // Transaction is deleted
    // Check if it is a newly deleted transaction
    await db('sale_transaction')
      .select('is_deleted')
      .where({ id: trans?.id })
      .first()
      .then(async (currTrans) => {
        if (!currTrans?.is_deleted) {
          // Transaction is newly deleted
          await dbDeleteSaleTransaction(trans, db)
        }
      })
  }
  return trans
}

export function dbGetSaleTransactions(db = connection) {
  return db('sale_transaction')
    .select(
      `sale_transaction.id`,
      `sale_transaction.sale_id`,
      `sale_transaction.clerk_id`,
      `sale_transaction.date`,
      `sale_transaction.payment_method`,
      `sale_transaction.amount`,
      `sale_transaction.cash_received`,
      `sale_transaction.change_given`,
      `sale_transaction.vendor_payment_id`,
      `sale_transaction.gift_card_id`,
      `sale_transaction.gift_card_taken`,
      `sale_transaction.register_id`,
      `sale_transaction.is_refund`,
      `sale_transaction.is_deleted`,
      `sale.item_list`,
      `sale.total_price`,
      `sale.store_cut`,
      `sale.number_of_items`,
      `sale.state`,
    )
    .leftJoin('sale', 'sale.id', 'sale_transaction.sale_id')
}

export async function dbGetSalesList(startDate, endDate, clerks, laybysOnly = false, db = connection) {
  let baseQuery = dbGetSaleTransactions(db)
    .where('sale_transaction.date', '>=', `${dayjs(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD hh:mm:ss')}`)
    .where('sale_transaction.date', '<=', `${dayjs(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD hh:mm:ss')}`)
  if (laybysOnly) baseQuery = baseQuery.where('sale.state', SaleStateTypes.Layby)
  if (clerks?.length > 0)
    baseQuery = baseQuery.whereIn(
      'sale_transaction.clerk_id',
      clerks?.split(',')?.map((clerk) => {
        return Number(clerk)
      }),
    )
  return baseQuery.orderBy('sale_transaction.date')
}

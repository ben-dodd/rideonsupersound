import dayjs from 'dayjs'
import { getItemQuantity } from 'features/sale/features/sell/lib/functions'
import { createMailOrderTask } from 'lib/api/jobs'
import {
  PaymentMethodTypes,
  SaleStateTypes,
  StockMovementTypes,
  VendorPaymentTypes,
} from 'lib/types'
import connection from './conn'
import { dbGetCustomer } from './customer'
import { dbCreateVendorPayment, dbUpdateVendorPayment } from './payment'
import {
  dbCreateStockItem,
  dbCreateStockMovement,
  dbGetStockItem,
  dbUpdateStockItem,
} from './stock'
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
      'note'
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
      'stock_price.date_valid_from as datePriceValidFrom'
    )
    .where(`stock_price.date_valid_from`, '<=', 'sale.date_sale_opened')
    .andWhereRaw(
      `stock_price.id = (
    SELECT MAX(id) FROM stock_price WHERE stock_id = sale_item.item_id)`
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
  return db('sale').insert(js2mysql(sale))
}

export function dbCreateHold(hold, db = connection) {
  return db('hold')
    .insert(js2mysql(hold))
    .then((res) => {
      // Create stock movement for hold
      // Check if restock necessary
    })
}

export function dbUpdateSale(id, update, db = connection) {
  return db('sale')
    .where({ id })
    .update(js2mysql(update))
    .then(() => id)
}

export function dbCreateSaleItem(saleItem, db = connection) {
  return db('sale_item').insert(js2mysql(saleItem))
}

export function dbUpdateSaleItem(id, update, db = connection) {
  return db('sale_item').where({ id }).update(js2mysql(update))
}

export function dbDeleteSaleItem(id, db = connection) {
  console.log(`Deleting ${id}`)
  return dbUpdateSaleItem(id, { isDeleted: true })
}

export function dbCreateSaleTransaction(saleTransaction, db = connection) {
  return db('sale_transaction').insert(js2mysql(saleTransaction))
}

export function dbUpdateSaleTransaction(id, update, db = connection) {
  return db('sale_transaction').where({ id }).update(js2mysql(update))
}

export async function dbSaveSale(sale, prevState, db = connection) {
  // Start the transaction
  const trx = await knex.transaction()
  try {
    // Insert the sale
    let saleId = sale?.id
    if (saleId) {
      dbUpdateSale(saleId, sale, db)
    } else {
      sale.state = sale?.state || SaleStateTypes.InProgress
      saleId = await dbCreateSale(sale, db)
    }
    if (sale?.isMailOrder && sale?.state === SaleStateTypes.Completed) {
      const customer = await dbGetCustomer(sale?.customerId)
      createMailOrderTask(sale, customer)
    }

    for await (const item of sale?.items) {
      handleSaveSaleItem(item, sale, prevState, db)
    }

    for await (const trans of sale?.transactions) {
      handleSaveSaleTransaction(trans, sale, db)
    }
    trx.commit()
  } catch (err) {
    // Roll back the transaction on error
    trx.rollback()
  }
}

export async function dbDeleteSale(id, { sale, clerk, registerID }) {
  // Start the transaction
  const trx = await knex.transaction()
  try {
    await sale?.items?.forEach((saleItem) => {
      dbUpdateSaleItem(saleItem?.id, { isDeleted: true })
      if (!saleItem?.isRefunded)
        dbCreateStockMovement({
          item: saleItem,
          clerk,
          registerID,
          act: StockMovementTypes.Unsold,
          note: 'Sale nuked.',
          saleId: sale?.id,
        })
    })
    await sale?.transactions?.forEach((saleTransaction) => {
      if (saleTransaction?.vendorPaymentId)
        dbUpdateVendorPayment(saleTransaction?.vendorPaymentId, {
          isDeleted: true,
        })
      dbUpdateSaleTransaction(saleTransaction?.id, { isDeleted: true })
    })
    // deleteStockMovementsFromDatabase(sale?.id);
    await dbUpdateSale(id, { isDeleted: true })
    trx.commit()
  } catch (err) {
    // Roll back the transaction on error
    trx.rollback()
  }
}

async function handleSaveSaleItem(item, sale, prevState, db) {
  let invItem = dbGetStockItem(item?.itemId)
  // Check whether inventory item needs restocking
  const quantity = getItemQuantity(invItem, sale?.items)
  let quantityLayby = invItem?.quantityLayby || 0
  // let quantity_sold = invItem?.quantity_sold || 0;
  if (quantity > 0) {
    await dbUpdateStockItem(item?.item_id, { needsRestock: true }, db)
  }

  // If sale is complete, validate gift card
  if (sale?.state === SaleStateTypes.Completed && item?.isGiftCard) {
    await dbUpdateStockItem(item?.itemId, { giftCardIsValid: true }, db)
  }

  await handleStockMovements(item, sale, prevState, db)

  // Add or update Sale Item
  if (!item?.id) {
    // Item is new to sale
    let newSaleItem = { ...item, saleId: sale?.id }
    await dbCreateSaleItem(newSaleItem, db)
  } else {
    // Item was already in sale, update in case discount, quantity has changed or item has been deleted
    await dbUpdateSaleItem(item?.id, item, db)
  }
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
    } else if (
      sale?.state === SaleStateTypes.Layby &&
      prevState !== SaleStateTypes.Layby
    ) {
      stockMovement.clerkId = sale?.laybyStartedBy
      stockMovement.act = StockMovementTypes.Layby
    }
    stockMovement.quantity = getQuantityByType(
      item?.quantity,
      stockMovement?.act
    )
    await dbCreateStockMovement(stockMovement, db)
  }
}

function getQuantityByType(quantity, act) {
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
        type: trans?.isRefund
          ? VendorPaymentTypes.SaleRefund
          : VendorPaymentTypes.Sale,
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
        await dbUpdateStockItem(
          trans?.giftCardUpdate,
          trans?.giftCardUpdate?.id,
          db
        )
      }
    }
    if (giftCardId) newSaleTransaction = { ...newSaleTransaction, giftCardId }
    await dbCreateSaleTransaction(newSaleTransaction, db)
  }
}

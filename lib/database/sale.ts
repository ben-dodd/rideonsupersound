import { getItemQuantity } from 'features/sale/features/sell/lib/functions'
import { createMailOrderTask } from 'lib/api/jobs'
import { SaleStateTypes, StockMovementTypes } from 'lib/types'
import connection from './conn'
import { dbGetCustomer } from './customer'
import {
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
    .where(`datePriceValidFrom`, '<=', 'sale.date_sale_opened')
    .andWhereRaw(
      `stock_price.id = (
    SELECT MAX(id) FROM stock_price WHERE stock_id = sale_item.item_id)`
    )
    .andWhere('sale.state', 'completed')
    .andWhere(`sale.is_deleted`, 0)
    .andWhere(`sale_item.is_deleted`, 0)
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
      let invItem = dbGetStockItem(item?.itemId)
      // Check whether inventory item needs restocking
      const quantity = getItemQuantity(invItem, sale?.items)
      let quantityLayby = invItem?.quantityLayby || 0
      // let quantity_sold = invItem?.quantity_sold || 0;
      if (quantity > 0) {
        dbUpdateStockItem(item?.item_id, { needsRestock: true }, db)
      }

      // If sale is complete, validate gift card
      if (sale?.state === SaleStateTypes.Completed && item?.isGiftCard) {
        dbUpdateStockItem(item?.itemId, { giftCardIsValid: true }, db)
      }

      // Add or update Sale Item
      if (!item?.id) {
        // Item is new to sale
        let newSaleItem = { ...item, saleId }
        dbCreateSaleItem(newSaleItem, db)
      } else {
        // Item was already in sale, update in case discount, quantity has changed or item has been deleted
        dbUpdateSaleItem(item?.id, item, db)
      }

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
            quantityLayby -= 1
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
          quantityLayby += 1
        }
        stockMovement.quantity = getQuantityByType(
          item?.quantity,
          stockMovement?.act
        )
        dbCreateStockMovement(stockMovement)
      }
    }
    //
    // HANDLE TRANSACTIONS
    //
    for await (const trans of sale?.transactions) {
      if (!trans?.id) {
        // Transaction is new to sale
        let newSaleTransaction = { ...trans, saleId }
        dbCreateSaleTransaction(newSaleTransaction)
      }
    }
    trx.commit()
  } catch (err) {
    // Roll back the transaction on error
    trx.rollback()
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

// This should be done at the save sale transaction stage
// export async function saveSaleTransaction(
//   transaction: SaleTransactionObject,
//   clerk: ClerkObject,
//   giftCards: GiftCardObject[],
//   mutateGiftCards: Function
// ) {
//   if (transaction?.paymentMethod === PaymentMethodTypes.Account) {
//     // Add account payment as a store payment to the vendor
//     let vendorPaymentId = null
//     const vendorPayment = {
//       amount: transaction?.amount,
//       clerkId: transaction?.clerkId,
//       vendorId: transaction?.vendor?.id,
//       type: transaction?.isRefund
//         ? VendorPaymentTypes.SaleRefund
//         : VendorPaymentTypes.Sale,
//       date: dayjs.utc().format(),
//       registerId: transaction?.registerId,
//     }
//     vendorPaymentId = await createVendorPaymentInDatabase(vendorPayment)
//     transaction = { ...transaction, vendorPayment: vendorPaymentId }
//   }
//   let giftCardId = null
//   if (transaction?.paymentMethod === PaymentMethodTypes.GiftCard) {
//     if (transaction?.isRefund) {
//       // Gift card is new, create new one
//       giftCardId = await createStockItemInDatabase(
//         transaction?.giftCardUpdate,
//         clerk
//       )
//     } else {
//       // Update gift card
//       updateStockItemInDatabase(transaction?.giftCardUpdate)
//     }
//     const otherGiftCards = giftCards?.filter(
//       (g: GiftCardObject) => g?.id !== transaction?.giftCardUpdate?.id
//     )
//     mutateGiftCards([...otherGiftCards, transaction?.giftCardUpdate], false)
//   }
//   if (giftCardId) transaction = { ...transaction, giftCardId }
//   createSaleTransactionInDatabase(transaction)
// }

import { StockMovementTypes, StockObject } from 'lib/types'
import { dbGetAllSalesAndItems } from './sale'
import { js2mysql } from './utils/helpers'
const connection = require('./conn')

export function dbGetStockList(db = connection) {
  return db('stock')
    .join('stock_movement', 'stock.id', '=', 'stock_movement.stock_id')
    .join('stock_price', 'stock.id', '=', 'stock_price.stock_id')
    .join('vendor', 'stock.vendor_id', '=', 'vendor.id')
    .groupBy('stock.id')
    .select(
      'stock.id',
      'stock.vendor_id',
      'vendor.name as vendorName',
      'stock.artist',
      'stock.title',
      'stock.display_as',
      'stock.media',
      'stock.format',
      'stock.section',
      'stock.country',
      'stock.is_new',
      'stock.cond',
      'stock.image_url',
      'stock.needs_restock',
      'stock_price.vendor_cut',
      'stock_price.total_sell'
    )
    .sum('stock_movement.quantity as quantity')
    .where(`stock.is_deleted`, 0)
    .andWhere(`stock.is_misc_item`, 0)
    .andWhere(`stock.is_gift_card`, 0)
    .andWhereRaw(
      `(stock_price.id = (SELECT MAX(id) FROM stock_price WHERE stock_id = stock.id))`
    )
}

export function dbGetRestockList(db = connection) {
  return db('stock')
    .select(
      'id',
      'vendor_id as vendorId',
      'artist',
      'title',
      'media',
      'format',
      'section'
    )
    .where(`needs_restock`, 1)
    .andWhere('is_deleted', 0)
}

export function dbGetStockItem(id, db = connection) {
  return db('stock')
    .where('stock.id', id)
    .first()
    .then(async (stockItem) => {
      const sales = await dbGetAllSalesAndItems(db).where(
        `sale_item.item_id`,
        stockItem?.id
      )
      const stockMovements = await db('stock_movement').where(
        `stock_id`,
        stockItem?.id
      )
      const quantity = stockMovements.reduce(
        (acc, stockMovement) => acc + stockMovement.quantity,
        0
      )
      const stockPrices = await db('stock_price').where(
        `stock_id`,
        stockItem?.id
      )
      return { ...stockItem, quantity, sales, stockMovements, stockPrices }
    })
}

export function dbGetStockItems(itemIds, db = connection) {
  return Promise.all(itemIds?.map((itemId) => dbGetStockItem(itemId, db)))
}

export function dbGetGiftCards(db = connection) {
  return db('stock')
    .select(
      'id',
      'is_gift_card',
      'gift_card_code',
      'gift_card_remaining',
      'gift_card_is_valid',
      'note',
      'date_created',
      'date_modified'
    )
    .where('is_gift_card', 1)
    .andWhere('is_deleted', 0)
}

export function dbCreateStockItem(stockItem, db = connection) {
  return db('stock').insert(js2mysql(stockItem))
}

export function dbUpdateStockItem(id, update, db = connection) {
  return db('stock').where({ id }).update(js2mysql(update))
}

export function dbCreateStockMovement(stockMovement, db = connection) {
  return db('stock_movement').insert(js2mysql(stockMovement))
}

export function dbCreateStockPrice(stockPrice, db = connection) {
  return db('stock_price').insert(js2mysql(stockPrice))
}

export function dbGetStocktakeTemplates(db = connection) {
  return db('stocktake_template').where(`is_deleted`, 0)
}

export function dbCreateStocktakeTemplate(stocktakeTemplate, db = connection) {
  return db('stocktake_template').insert(js2mysql(stocktakeTemplate))
}

export function dbDeleteStockItem(id, db = connection) {
  return db('stock').where({ id }).update({ is_deleted: 1 })
}

export async function dbReceiveStock(receiveStock: any, db = connection) {
  // return received stock?
  const trx = await knex.transaction()
  try {
    const { clerkId, registerId, vendorId } = receiveStock
    const receivedStock = []
    await Promise.all(
      receiveStock?.items?.map(async (receiveItem: any) => {
        if (receiveItem?.item?.id) {
          await dbCreateStockMovement(
            {
              item_id: receiveItem?.item?.id,
              quantity: receiveItem?.quantity,
              clerkId,
              registerId,
              act: StockMovementTypes?.Received,
              note: 'Existing stock received.',
            },
            db
          )
          receivedStock.push({
            item: receiveItem?.item,
            quantity: receiveItem?.quantity,
          })
        } else {
          const stockId = await dbCreateStockItem(
            { ...receiveItem?.item, vendorId },
            db
          )
          dbCreateStockPrice(
            {
              stockId,
              clerkId,
              totalSell: parseFloat(receiveItem?.totalSell) * 100,
              vendorCut: parseFloat(receiveItem?.vendorCut) * 100,
              note: 'New stock priced.',
            },
            db
          )
          await dbCreateStockMovement(
            {
              stockId,
              clerkId,
              quantity: receiveItem?.quantity,
              registerId,
              act: StockMovementTypes?.Received,
              note: 'New stock received.',
            },
            db
          )
          receivedStock.push({
            item: {
              ...receiveItem?.item,
              vendorId,
              totalSell: parseFloat(receiveItem?.totalSell) * 100,
              id: stockId,
            },
            quantity: receiveItem?.quantity,
          })
        }
      })
    )
    trx.commit()
  } catch (err) {
    // Roll back the transaction on error
    trx.rollback()
  }
}

export async function dbReturnStock(returnStock: any, db = connection) {
  const trx = await knex.transaction()
  try {
    const { clerkId, registerId, vendorId, items, note } = returnStock
    if (vendorId && items?.length > 0) {
      items
        .filter((returnItem: any) => parseInt(`${returnItem?.quantity}`) > 0)
        .forEach(async (returnItem: any) => {
          await dbGetStockItem(returnItem?.id).then((stockItem) =>
            dbUpdateStockItem(returnItem?.id, {
              quantityReturn:
                (stockItem?.quantityReturned || 0) +
                parseInt(returnItem?.quantity),
              quantity:
                (stockItem?.quantity || 0) - parseInt(returnItem?.quantity),
            })
          )
          await dbCreateStockMovement(
            {
              itemId: parseInt(returnItem?.id),
              quantity: `${returnItem?.quantity}`,
              clerkId,
              registerId,
              act: StockMovementTypes?.Returned,
              note: note || 'Stock returned to vendor.',
            },
            db
          )
        })
    }
    trx.commit()
  } catch (err) {
    // Roll back the transaction on error
    trx.rollback()
  }
}

export async function dbChangeStockQuantity(
  change: any,
  id: any,
  db = connection
) {
  const trx = await knex.transaction()
  try {
    const { stockItem, quantity, movement, clerkId, registerId, note } = change
    const itemId = Number(id)
    // todo Change stockItem quantity so it gets direct from database
    let originalQuantity = stockItem?.quantity
    let newQuantity = stockItem?.quantity
    let adjustment = parseInt(quantity)
    if (movement === StockMovementTypes?.Adjustment) {
      newQuantity = parseInt(quantity)
      adjustment = newQuantity - originalQuantity
    } else if (
      movement === StockMovementTypes?.Discarded ||
      movement === StockMovementTypes?.Lost ||
      movement === StockMovementTypes?.Returned
    ) {
      newQuantity -= adjustment
    } else {
      newQuantity += adjustment
    }
    await dbCreateStockMovement(
      {
        itemId,
        quantity:
          movement === StockMovementTypes?.Adjustment
            ? adjustment
            : Number(quantity),
        clerkId,
        registerId,
        act: movement,
        note,
      },
      db
    )
    trx.commit()
  } catch (err) {
    // Roll back the transaction on error
    trx.rollback()
  }
}

export function dbGetWebStock(condition, db = connection) {
  return db('stock')
    .select(
      'stock.artist',
      'stock.title',
      'stock.format',
      'stock.is_new',
      'stock_price.total_sell'
    )
    .leftJoin('stock_price', 'stock.id', 'stock_price.stock_id')
    .leftJoin('stock_movement', 'stock.id', 'stock_movement.stock_id')
    .sum('stock_movement.quantity as quantity')
    .groupBy('stock.id')
    .where(`stock.is_deleted`, 0)
    .andWhere(`stock.is_misc_item`, 0)
    .andWhere(`stock.is_gift_card`, 0)
    .andWhere(`stock.do_list_on_website`, 1)
    .andWhereRaw(condition)
    .andWhereRaw(
      `(stock_price.id = (SELECT MAX(id) FROM stock_price WHERE stock_id = stock.id))`
    )
    .orderBy(['stock.format', 'stock.artist', 'stock.title'])
    .then((stock) => stock.filter((stockItem) => stockItem?.quantity > 0))
}

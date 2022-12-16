import { dbUpdateSale } from './sale'
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
      const sales = await db('sale_item')
        .join('sale', 'sale_item.sale_id', 'sale.id')
        .where(`item_id`, stockItem?.id)
      const stockMovements = await db('stock_movement').where(
        `stock_id`,
        stockItem?.id
      )
      const stockPrices = await db('stock_price').where(
        `stock_id`,
        stockItem?.id
      )
      return { ...stockItem, sales, stockMovements, stockPrices }
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

export function dbGetStocktakeTemplates(db = connection) {
  return db('stocktake_template').where(`is_deleted`, 0)
}

export function dbCreateStocktakeTemplate(stocktakeTemplate, db = connection) {
  return db('stocktake_template').insert(js2mysql(stocktakeTemplate))
}

export function dbDeleteStockItem(id, db = connection) {
  return db('stock').where({ id }).update({ is_deleted: 1 })
}

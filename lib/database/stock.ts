import { StockMovementTypes } from 'lib/types/stock'
import { dbGetAllSalesAndItems, dbGetSaleTransactions, getStockMovementQuantityByAct } from './sale'
import { js2mysql } from './utils/helpers'
const connection = require('./conn')

export function dbGetStockList(db = connection) {
  return db('stock')
    .leftJoin('stock_movement', 'stock.id', 'stock_movement.stock_id')
    .groupBy('stock.id')
    .select(
      'stock.id',
      'stock.vendor_id',
      'stock.artist',
      'stock.title',
      'stock.display_as',
      'stock.media',
      'stock.format',
      'stock.section',
      'stock.genre',
      'stock.is_new',
      'stock.cond',
      'stock.tags',
    )
    .sum('stock_movement.quantity as quantity')
    .where(`stock.is_deleted`, 0)
    .where(`stock.is_misc_item`, 0)
    .where(`stock.is_gift_card`, 0)
}

// export function dbGetStockList(db = connection) {
//   return db('stock')
//     .leftJoin('stock_movement', 'stock.id', 'stock_movement.stock_id')
//     .leftJoin('stock_price', 'stock.id', 'stock_price.stock_id')
//     .leftJoin('vendor', 'stock.vendor_id', 'vendor.id')
//     .groupBy('stock.id')
//     .select(
//       'stock.id',
//       'stock.vendor_id',
//       'vendor.name as vendorName',
//       'stock.artist',
//       'stock.title',
//       'stock.display_as',
//       'stock.media',
//       'stock.format',
//       'stock.section',
//       'stock.country',
//       'stock.is_new',
//       'stock.cond',
//       'stock.image_url',
//       'stock.needs_restock',
//       'stock_price.vendor_cut',
//       'stock_price.total_sell',
//       knex.raw('SUM(stock_movement.quantity) as total_quantity'),
//       knex.raw(
//         'SUM(CASE WHEN stock_movement.act IN ("hold", "unhold") THEN stock_movement.quantity ELSE 0 END) as hold_quantity'
//       ),
//       knex.raw(
//         'SUM(CASE WHEN stock_movement.act IN ("layby", "unlayby") THEN stock_movement.quantity ELSE 0 END) as layby_quantity'
//       )
//     )
//     .where(`stock.is_deleted`, 0)
//     .where(`stock.is_misc_item`, 0)
//     .where(`stock.is_gift_card`, 0)
//     .andWhereRaw(
//       `(stock_price.id = (SELECT MAX(id) FROM stock_price WHERE stock_id = stock.id))`
//     )
// }

export function dbGetRestockList(db = connection) {
  return db('stock')
    .select('id', 'vendor_id as vendorId', 'artist', 'title', 'media', 'format', 'section')
    .where(`needs_restock`, 1)
    .andWhere('is_deleted', 0)
}

export function dbGetStockItem(id, basic = false, db = connection) {
  return db('stock')
    .select(
      basic
        ? [
            'id',
            'vendor_id',
            'artist',
            'title',
            'display_as',
            'media',
            'section',
            'format',
            'is_new',
            'cond',
            'country',
            'image_url',
            'needs_restock',
            'is_gift_card',
            'gift_card_code',
            'gift_card_amount',
            'is_misc_item',
            'misc_item_description',
            'misc_item_amount',
          ]
        : '*',
    )
    .where({ id })
    .first()
    .then(async (item) => {
      if (!item) throw new Error('Item not found.')
      if (item?.discogsItem) item.discogsItem = JSON.parse(item.discogsItem)
      if (item?.googleBooksItem) item.googleBooksItem = JSON.parse(item.googleBooksItem)
      const stockMovements = await db('stock_movement')
        .where(`stock_id`, item?.id)
        .where('is_deleted', 0)
        .orderBy('date_moved', 'desc')
      const stockPrices = await db('stock_price')
        .where(`stock_id`, item?.id)
        .where('is_deleted', 0)
        .orderBy('date_valid_from', 'desc')
      const quantities: any = {
        inStock: stockMovements.reduce((acc, stockMovement) => acc + stockMovement.quantity, 0),
        layby: getQuantities([StockMovementTypes.Layby, StockMovementTypes.Unlayby], stockMovements, true),
        hold: getQuantities([StockMovementTypes.Hold, StockMovementTypes.Unhold], stockMovements, true),
      }
      const latestPrice = stockPrices[0]
      const totalSell = latestPrice?.total_sell
      const vendorCut = latestPrice?.vendor_cut
      const storeCut = item?.isMiscItem ? item?.miscItemAmount : totalSell - vendorCut
      const price = { totalSell, vendorCut, storeCut }
      if (basic) return { item, quantities, price }
      // Add other quantity params as needed
      quantities.received = getQuantities([StockMovementTypes.Received], stockMovements)
      quantities.sold = getQuantities([StockMovementTypes.Sold], stockMovements, true)
      quantities.returned = getQuantities([StockMovementTypes.Returned], stockMovements, true)
      quantities.laybyHold = quantities.layby + quantities.hold
      quantities.discarded = getQuantities([StockMovementTypes.Discarded], stockMovements, true)
      quantities.lost = getQuantities([StockMovementTypes.Lost, StockMovementTypes.Found], stockMovements, true)
      quantities.discardedLost = quantities.discarded + quantities.lost
      quantities.refunded = getQuantities([StockMovementTypes.Unsold], stockMovements)
      quantities.adjustment = getQuantities([StockMovementTypes.Adjustment], stockMovements)
      const sales = await dbGetAllSalesAndItems(db).where(`sale_item.item_id`, item?.id)
      return { item, quantities, price, sales, stockMovements, stockPrices }
    })
    .catch((err) => {
      throw new Error(err.message)
    })
}

export function getQuantities(types, stockMovements, reverse = false) {
  const sum = stockMovements
    .filter((stockMovement) => types.includes(stockMovement?.act))
    .reduce((acc, stockMovement) => acc + stockMovement.quantity, 0)
  return reverse ? sum * -1 : sum
}

export function dbGetStockItems(itemIds, db = connection) {
  return Promise.all(itemIds?.map((itemId) => dbGetStockItem(itemId, true, db)))
}

export function dbGetGiftCards(db = connection) {
  return db('stock')
    .select(
      'id',
      'is_gift_card',
      'gift_card_amount',
      'gift_card_code',
      'gift_card_remaining',
      'gift_card_is_valid',
      'note',
      'date_created',
      'date_modified',
    )
    .where('is_gift_card', 1)
    .andWhere('is_deleted', 0)
}

export function dbGetGiftCard(id, db = connection) {
  return dbGetGiftCards(db)
    .where({ id })
    .first()
    .then((giftCard) =>
      dbGetSaleTransactions(db)
        .where(`sale_transaction.gift_card_id`, id)
        .then((saleTransactions) => ({ giftCard, saleTransactions })),
    )
}

export function dbCreateStockItem(stockItem, db = connection) {
  return db('stock').insert(js2mysql(stockItem))
}

export function dbUpdateStockItem(update, id, db = connection) {
  return db('stock').where({ id }).update(js2mysql(update))
}

export function dbCreateStockMovement(stockMovement, db = connection) {
  return db('stock_movement')
    .insert(js2mysql(stockMovement))
    .then((res) => {
      return res.data
    })
    .catch((e) => Error(e.message))
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
  return db
    .transaction(async (trx) => {
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
              trx,
            )
            receivedStock.push({
              item: receiveItem?.item,
              quantity: receiveItem?.quantity,
            })
          } else {
            const stockId = await dbCreateStockItem({ ...receiveItem?.item, vendorId }, trx)
            dbCreateStockPrice(
              {
                stockId,
                clerkId,
                totalSell: parseFloat(receiveItem?.totalSell) * 100,
                vendorCut: parseFloat(receiveItem?.vendorCut) * 100,
                note: 'New stock priced.',
              },
              trx,
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
              trx,
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
        }),
      )
    })
    .then((res) => res)
    .catch((e) => Error(e.message))
}

export async function dbReturnStock(returnStock: any, db = connection) {
  return db
    .transaction(async (trx) => {
      const { clerkId, registerId, vendorId, items, note } = returnStock
      if (vendorId && items?.length > 0) {
        items
          .filter((returnItem: any) => parseInt(`${returnItem?.quantity}`) > 0)
          .forEach(async (returnItem: any) => {
            await dbGetStockItem(returnItem?.id, trx).then((stockItem) =>
              dbUpdateStockItem(
                returnItem?.id,
                {
                  quantityReturn: (stockItem?.quantityReturned || 0) + parseInt(returnItem?.quantity),
                  quantity: (stockItem?.quantity || 0) - parseInt(returnItem?.quantity),
                },
                trx,
              ),
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
              trx,
            )
          })
      }
    })
    .then((id) => id)
    .catch((e) => Error(e.message))
}

export async function dbChangeStockQuantity(change: any, id: any, db = connection) {
  console.log(change)
  const { stockItem, quantity, movement, clerkId, registerId, note } = change
  const { quantities = {} } = stockItem || {}
  const stockId = Number(id)
  // TODO Change stockItem quantity so it gets direct from database
  // TODO make quantities a type
  let originalQuantity = quantities?.inStock
  let newQuantity = quantities?.inStock
  let adjustment = parseInt(quantity)
  if (movement === StockMovementTypes?.Adjustment) {
    newQuantity = parseInt(quantity)
    adjustment = newQuantity - originalQuantity
  } else {
    adjustment = getStockMovementQuantityByAct(quantity, movement)
    newQuantity += adjustment
  }
  return dbCreateStockMovement(
    {
      stockId,
      quantity: adjustment,
      clerkId,
      registerId,
      act: movement,
      note,
    },
    db,
  )
    .then((res) => {
      console.log(res)
      res.data
    })
    .catch((e) => Error(e.message))
}

export function dbGetWebStock(condition = '', db = connection) {
  return db('stock')
    .select('stock.artist', 'stock.title', 'stock.format', 'stock.is_new', 'stock_price.total_sell')
    .leftJoin('stock_price', 'stock.id', 'stock_price.stock_id')
    .leftJoin('stock_movement', 'stock.id', 'stock_movement.stock_id')
    .sum('stock_movement.quantity as quantity')
    .groupBy('stock.id')
    .where(`stock.is_deleted`, 0)
    .andWhere(`stock.is_misc_item`, 0)
    .andWhere(`stock.is_gift_card`, 0)
    .andWhere(`stock.do_list_on_website`, 1)
    .andWhereRaw(condition)
    .andWhereRaw(`(stock_price.id = (SELECT MAX(id) FROM stock_price WHERE stock_id = stock.id))`)
    .orderBy(['stock.format', 'stock.artist', 'stock.title'])
    .then((stock) => stock.filter((stockItem) => stockItem?.quantity > 0))
}

export function dbCheckIfRestockNeeded(itemId, db = connection) {
  return db('stock_movement')
    .sum('quantity as totalQuantity')
    .where('stock_id', itemId)
    .first()
    .then((res) =>
      res.totalQuantity > 0 ? dbUpdateStockItem({ needsRestock: true }, itemId, db).then(() => true) : false,
    )
}

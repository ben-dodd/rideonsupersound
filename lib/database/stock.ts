import { getImageSrc, getItemSkuDisplayName } from 'lib/functions/displayInventory'
import { BatchReceiveObject, StockMovementTypes } from 'lib/types/stock'
import { dbGetAllSalesAndItems, dbGetSaleTransactions, getStockMovementQuantityByAct } from './sale'
import { js2mysql } from './utils/helpers'
import { SaleStateTypes } from 'lib/types/sale'
import { createBatchList } from 'lib/functions/stock'
const connection = require('./conn')

export function dbGetStockList(db = connection) {
  return db('stock')
    .leftJoin('stock_movement', 'stock.id', 'stock_movement.stock_id')
    .leftJoin('vendor', 'stock.vendor_id', 'vendor.id')
    .groupBy('stock.id')
    .select(
      'stock.id',
      'stock.vendor_id',
      'vendor.name as vendor_name',
      'stock.artist',
      'stock.title',
      'stock.display_as',
      // 'stock.image_url',
      'stock.media',
      'stock.format',
      'stock.section',
      'stock.genre',
      'stock.is_new',
      'stock.cond',
      'stock.tags',
      'stock.needs_restock',
    )
    .sum('stock_movement.quantity as quantity')
    .where(`stock.is_deleted`, 0)
    .where(`stock.is_misc_item`, 0)
    .where(`stock.is_gift_card`, 0)
}

export function dbGetSimpleStockCount(db = connection) {
  return db('stock')
    .leftJoin('stock_movement', 'stock.id', 'stock_movement.stock_id')
    .select('stock.id', 'stock.vendor_id', 'stock.artist', 'stock.title')
    .sum('stock_movement.quantity as quantity')
    .where(`stock.is_deleted`, 0)
    .where(`stock.is_misc_item`, 0)
    .where(`stock.is_gift_card`, 0)
}

export function dbGetPrintLabelStockList(db = connection) {
  return db('stock')
    .leftJoin('vendor', 'stock.vendor_id', 'vendor.id')
    .leftJoin('stock_price', 'stock.id', 'stock_price.stock_id')
    .select(
      'stock.id',
      'stock.vendor_id',
      'vendor.name as vendor_name',
      'stock_price.total_sell',
      'stock.artist',
      'stock.title',
      'stock.display_as',
      'stock.format',
      'stock.section',
      'stock.is_new',
    )
    .where(`stock.is_deleted`, 0)
    .where(`stock.is_misc_item`, 0)
    .where(`stock.is_gift_card`, 0)
    .whereRaw(`(stock_price.id = (SELECT MAX(id) FROM stock_price WHERE stock_id = stock.id))`)
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
      // if (item?.discogsItem) item.discogsItem = JSON.parse(item.discogsItem)
      // if (item?.googleBooksItem) item.googleBooksItem = JSON.parse(item.googleBooksItem)
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
      const sales = await dbGetAllSalesAndItems(db)
        .where(`sale_item.item_id`, item?.id)
        .orderBy('date_sale_closed', 'desc')
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

export function dbGetStockItems(itemIds, basic = true, db = connection) {
  return Promise.all(itemIds?.map((itemId) => dbGetStockItem(itemId, basic, db)))
}

export function dbGetStockItemsForVendor(vendorId, db = connection) {
  return db('stock')
    .select('id')
    .where('vendor_id', vendorId)
    .then((ids) =>
      dbGetStockItems(
        ids?.map((item) => item?.id),
        db,
      ),
    )
}

export function dbGetStockMovements(limit, db = connection) {
  return db('stock_movement')
    .leftJoin('clerk', 'clerk.id', 'stock_movement.clerk_id')
    .leftJoin('stock', 'stock.id', 'stock_movement.stock_id')
    .leftJoin('vendor', 'vendor.id', 'stock.vendor_id')
    .select(
      'stock_movement.id',
      'stock_movement.date_moved',
      'stock_movement.act',
      'stock_movement.quantity',
      'clerk.name as clerk_name',
      'stock_movement.stock_id',
      'stock.vendor_id as stock_vendor_id',
      'stock.is_gift_card as stock_is_gift_card',
      'stock.is_misc_item as stock_is_misc_item',
      'stock.gift_card_code as stock_gift_card_code',
      'stock.misc_item_description as stock_misc_item_description',
      'stock.display_as as stock_display_as',
      'stock.artist as stock_artist',
      'stock.title as stock_title',
      'stock.format as stock_format',
      'stock.image_url as stock_image_url',
    )
    .orderBy('id', 'desc')
    .limit(limit)
    .then((dataRows) => {
      return dataRows?.map((row) => ({
        id: row?.id,
        date_moved: row?.date_moved,
        act: row?.act,
        quantity: row?.quantity,
        clerk_name: row?.clerk_name,
        stock_id: row?.stock_id,
        vendor_id: row?.vendor_id,
        image_src: getImageSrc({
          imageUrl: row?.stock_image_url,
          isGiftCard: row?.stock_is_gift_card,
          format: row?.stock_format,
        }),
        item_display_name: getItemSkuDisplayName({
          id: row?.stock_id,
          vendorId: row?.stock_vendor_id,
          isGiftCard: row?.stock_is_gift_card,
          isMiscItem: row?.stock_is_misc_item,
          giftCardCode: row?.stock_gift_card_code,
          miscItemDescription: row?.stock_misc_item_description,
          displayAs: row?.stock_display_as,
          artist: row?.stock_artist,
          title: row?.stock_title,
        }),
      }))
    })
}

export function dbGetGiftCards(db = connection) {
  return db('stock')
    .select('id', 'gift_card_amount', 'gift_card_code', 'gift_card_remaining', 'gift_card_is_valid')
    .where('is_gift_card', 1)
    .where('is_deleted', 0)
}

export function dbGetGiftCard(id, db = connection) {
  return db('stock')
    .leftJoin('sale_item', 'sale_item.item_id', 'stock.id')
    .select(
      'stock.id',
      'stock.gift_card_amount',
      'stock.gift_card_code',
      'stock.gift_card_remaining',
      'stock.gift_card_is_valid',
      'stock.note',
      'stock.date_created',
      'stock.date_modified',
      'sale_item.sale_id',
    )
    .where('stock.id', id)
    .first()
    .then((giftCard) =>
      dbGetSaleTransactions(db)
        .where(`sale_transaction.gift_card_id`, id)
        .then((saleTransactions) => ({ giftCard, saleTransactions })),
    )
}

export function dbCreateStockItem(stockItem, db = connection) {
  return db('stock')
    .insert(js2mysql(stockItem))
    .then((rows) => rows?.[0])
    .catch((e) => Error(e.message))
}

export function dbUpdateStockItem(update, id, db = connection) {
  return db('stock').where({ id }).update(js2mysql(update))
}

export function dbCreateStockMovement(stockMovement, db = connection) {
  console.log(js2mysql(stockMovement))
  return db('stock_movement')
    .insert(js2mysql(stockMovement))
    .then((rows) => {
      return rows?.[0]
    })
    .catch((e) => Error(e.message))
}

export function dbCreateStockPrice(stockPrice, db = connection) {
  return db('stock_price').insert(js2mysql(stockPrice))
}

export function dbDeleteStockPrice(id, db = connection) {
  return db('stock_price').where({ id }).update({ is_deleted: 1 })
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

export async function dbReceiveStock(receiveBatch: BatchReceiveObject, db = connection) {
  const { batchList = [], vendorId, completedByClerkId: clerkId, id: batchReceiveId } = receiveBatch || {}
  console.log('Receiving stock', batchList)
  return db
    .transaction(async (trx) => {
      const receivedStock = []
      await Promise.all(
        batchList?.map(async (batchItem: any) => {
          if (batchItem?.item?.id) {
            await dbCreateStockMovement(
              {
                stockId: batchItem?.item?.id,
                quantity: batchItem?.quantity,
                clerkId,
                batchReceiveId,
                act: StockMovementTypes?.Received,
                note: 'Existing stock received.',
              },
              trx,
            )
            receivedStock.push({
              item: batchItem?.item,
              quantity: batchItem?.quantity,
            })
          } else {
            const stockId = await dbCreateStockItem({ ...batchItem?.item, vendorId }, trx)
            await dbCreateStockPrice(
              {
                stockId,
                clerkId,
                totalSell: batchItem?.price?.totalSell,
                vendorCut: batchItem?.price?.vendorCut,
                note: 'New stock priced.',
              },
              trx,
            )
            await dbCreateStockMovement(
              {
                stockId,
                clerkId,
                quantity: batchItem?.quantity,
                batchReceiveId,
                act: StockMovementTypes?.Received,
                note: 'New stock received.',
              },
              trx,
            )
            receivedStock.push({
              item: {
                ...batchItem?.item,
                vendorId,
                totalSell: batchItem?.totalSell,
                id: stockId,
              },
              quantity: batchItem?.quantity,
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
            await dbCreateStockMovement(
              {
                stockId: parseInt(returnItem?.id),
                quantity: parseInt(`${returnItem?.quantity}`) * -1,
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

export function dbCheckIfRestockNeeded(itemId, state, db = connection) {
  return db('stock_movement')
    .sum('quantity as totalQuantity')
    .where('stock_id', itemId)
    .first()
    .then((res) =>
      res.totalQuantity > 0 && (state === SaleStateTypes.Completed || state === SaleStateTypes.Layby)
        ? dbUpdateStockItem({ needsRestock: true }, itemId, db).then(() => true)
        : false,
    )
}

export function dbGetReceiveBatches(db = connection) {
  return db('batch_receive').where({ is_deleted: false }).orderBy('id', 'desc')
}

export function dbGetReceiveBatch(id, db = connection) {
  return db('batch_receive')
    .leftJoin('clerk as startedByClerk', 'startedByClerk.id', 'batch_receive.started_by_clerk_id')
    .leftJoin('clerk as completedByClerk', 'completedByClerk.id', 'batch_receive.completed_by_clerk_id')
    .leftJoin('vendor', 'vendor.id', 'batch_receive.vendor_id')
    .select(
      'batch_receive.*',
      'vendor.name as vendor_name',
      'startedByClerk.name as started_by_clerk_name',
      'completedByClerk.name as completed_by_clerk_name',
    )
    .where('batch_receive.id', id)
    .first()
    .then((batch) =>
      // batch?.batch_list
      //   ? batch :
      dbGetStockMovementsForReceiveBatch(id, db)
        .then((stockMovements) => {
          return {
            batch,
            stockMovements,
          }
        })
        .then(({ batch, stockMovements }) =>
          dbGetStockItems(
            stockMovements?.map((sm) => sm?.stock_id),
            false,
            db,
          ).then((stockItems) => ({
            ...batch,
            batchList: createBatchList(stockItems, stockMovements),
          })),
        ),
    )
}

export function dbGetStockMovementsForReceiveBatch(id, db) {
  return db('stock_movement').where({ batch_receive_id: id, is_deleted: 0 })
}

export function dbUpdateReceiveBatch(update, id, db = connection) {
  // console.log('updating batch ', id, update)
  return db('batch_receive').where({ id }).update(js2mysql(update))
}

export function dbCreateReceiveBatch(receiveBatch, db = connection) {
  return db('batch_receive')
    .insert(js2mysql(receiveBatch))
    .then((rows) => rows[0])
    .catch((e) => Error(e.message))
}

export async function dbSaveReceiveBatch(receiveBatch, doComplete = false, db = connection) {
  return db.transaction(async (trx) => {
    delete receiveBatch.vendorName
    delete receiveBatch.startedByClerkName
    delete receiveBatch.completedByClerkName

    let batchId = receiveBatch?.id
    const { batchList = [] } = receiveBatch || []
    if (batchId) {
      await dbUpdateReceiveBatch({ ...receiveBatch, batchList: JSON.stringify(batchList) }, batchId, trx)
    } else {
      batchId = await dbCreateReceiveBatch({ ...receiveBatch, batchList: JSON.stringify(batchList) }, trx)
    }

    if (doComplete) {
      await dbReceiveStock({ ...receiveBatch, id: batchId }, trx)
    }

    return dbGetReceiveBatch(batchId, trx)
  })
}

export async function dbDeleteReceiveBatch(batchId, db = connection) {
  console.log('Deleting', batchId)
  return db.transaction(async (trx) => {
    await dbUpdateReceiveBatch({ isDeleted: true }, batchId, trx)
    await trx('stock_movement').update({ is_deleted: true }).where({ batch_receive_id: batchId })
  })
}

export function dbGetCurrentReceiveBatchId(db = connection) {
  return db('batch_receive')
    .select('id')
    .where({ is_deleted: 0 })
    .where({ date_completed: null })
    .where('id', '>', 1629)
    .first()
    .then((batch) => batch?.id)
}

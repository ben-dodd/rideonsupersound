import connection from './conn'
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
  return db('sale').where({ id }).update(js2mysql(update))
}

export function dbCreateSaleItem(sale, db = connection) {
  return db('sale_item').insert(js2mysql(sale))
}

export function dbUpdateSaleItem(id, update, db = connection) {
  return db('sale_item').where({ id }).update(js2mysql(update))
}

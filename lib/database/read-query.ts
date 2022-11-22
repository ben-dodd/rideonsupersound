import { StockMovementTypes } from 'lib/types'

/*
 *  ACCOUNT/CLERK QUERIES
 */

export function getAccountQuery(email: string) {
  return {
    columns: ['id', 'email', 'is_admin', 'is_authenticated'],
    table: 'account',
    where: `email='${email}'`,
  }
}

export function getAccountClerksQuery(account_id: number) {
  return {
    table: 'clerk',
    where: `id IN (
        SELECT clerk_id
        FROM account_clerk
        WHERE account_id = ${account_id}
      )`,
    orderBy: 'colour',
  }
}

export function getClerksQuery() {
  return {
    table: 'clerk',
    orderBy: 'colour',
  }
}

/*
 *  VENDOR QUERIES
 */

export function getVendorsQuery() {
  return { table: 'vendor', where: `NOT is_deleted` }
}

export function getVendorNamesQuery() {
  return {
    columns: ['id', 'name'],
    table: 'vendor',
    where: `NOT is_deleted`,
  }
}

export function getVendorByUidQuery(vendor_id: number) {
  return {
    table: 'vendor',
    where: `uid = ${vendor_id}`,
  }
}

export function getVendorFromVendorPaymentQuery(vendor_payment_id: number) {
  return {
    table: 'vendor',
    where: `id IN
  (SELECT vendor_id
    FROM vendor_payment
    WHERE id = ${vendor_payment_id}
  )`,
  }
}

/*
 *  CUSTOMER QUERIES
 */

export function getCustomerQuery(customer_id: number) {
  return { table: 'customer', where: `id = ${customer_id}` }
}

export function getCustomersQuery() {
  return { table: 'customer', where: `NOT is_deleted` }
}

/*
 * PAYMENT QUERIES
 */

export function getVendorPaymentsQuery() {
  return {
    table: 'vendor_payment',
    where: 'NOT is_deleted',
  }
}

export function getVendorTotalPaymentsQuery(vendor_id: number) {
  return {
    columns: ['date', 'amount'],
    table: 'vendor_payment',
    where: `vendor_id = ${vendor_id} AND NOT is_deleted`,
  }
}

export function getVendorPaymentsByVendorUid(vendor_uid: string) {
  return {
    table: 'vendor_payment',
    where: [
      `NOT is_deleted`,
      `vendor_id = (SELECT id FROM vendor WHERE uid = '${vendor_uid}')`,
    ],
    orderBy: 'date',
    isDesc: 'true',
  }
}

export function getVendorStoreCreditByVendorUid(vendor_uid: string) {
  return {
    table: 'sale',
    columns: 'item_list',
    innerJoin: [{}],
  }
}

/*
 *  SALES QUERIES
 */

export function getSalesQuery() {
  return {
    columns: [
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
    ],
    table: 'sale',
    where: `NOT is_deleted`,
  }
}

export function getSalesJoinedQuery() {
  return {
    columns: [
      'id',
      'sale_id',
      'item_id',
      'quantity',
      'store_discount',
      'vendor_discount',
      'is_refunded',
    ],
    table: 'sale_item',
    joins: [
      {
        columns: ['vendor_id'],
        table: 'stock',
        on: 'sale_item.item_id = stock.id',
      },
      {
        columns: [
          'date_sale_opened',
          'date_sale_closed',
          'store_cut',
          'total_price',
          'number_of_items',
          'item_list',
        ],
        table: 'sale',
        on: 'sale.id = sale_item.sale_id',
      },
      {
        columns: [
          'vendor_cut',
          'total_sell',
          { key: 'date_valid_from', as: 'date_price_valid_from' },
        ],
        table: 'stock_price',
        on: 'stock_price.stock_id = sale_item.item_id',
      },
    ],
    where: [
      `stock_price.date_valid_from <= sale.date_sale_opened`,
      `stock_price.id = (
      SELECT MAX(id) FROM stock_price WHERE stock_id = sale_item.item_id)`,
      `sale.state = 'completed'`,
      `sale.is_deleted = 0`,
      `sale_item.is_deleted = 0`,
    ],
  }
}

export function getSaleByIdQuery(sale_id: number) {
  return { table: 'sale', where: `id = ${sale_id}` }
}

export function getSaleItemsByIdQuery(sale_id: number) {
  return { table: 'sale_item', where: `sale_id = ${sale_id}` }
}

export function getSaleTransactionsByIdQuery(sale_id: number) {
  return { table: 'sale_transaction', where: `sale_id = ${sale_id}` }
}

export function getSaleItemsQuery() {
  return { table: 'sale_item' }
}

export function getSaleWithItemsQuery(sale_id?) {
  const where = [
    `stock_price.date_valid_from <= sale.date_sale_opened`,
    `stock_price.id = (
    SELECT MAX(id) FROM stock_price WHERE stock_id = sale_item.item_id)`,
    `sale.state = 'completed'`,
    `sale.is_deleted = 0`,
    `sale_item.is_deleted = 0`,
  ]
  if (sale_id) where.unshift(`sale.id = ${sale_id}`)
  return {
    columns: [
      'id',
      'sale_id',
      'item_id',
      'quantity',
      'store_discount',
      'vendor_discount',
      'is_refunded',
      'date_refunded',
      'is_gift_card',
      'is_misc_item',
    ],
    table: 'sale_item',
    joins: [
      {
        columns: ['vendor_id'],
        table: 'stock',
        on: 'sale_item.item_id = stock.id',
      },
      {
        columns: [
          'date_sale_opened',
          'date_sale_closed',
          'store_cut',
          'total_price',
          'number_of_items',
          'item_list',
        ],
        table: 'sale',
        on: 'sale.id = sale_item.sale_id',
      },
      {
        columns: [
          'vendor_cut',
          'total_sell',
          { key: 'date_valid_from', as: 'date_price_valid_from' },
        ],
        table: 'stock_price',
        on: 'stock_price.stock_id = sale_item.item_id',
      },
    ],
    where,
  }
}

export function getSaleTransactionsForRangeQuery(start_date, end_date) {
  return {
    table: 'sale_transaction',
    columns: [
      'id',
      'sale_id',
      'clerk_id',
      'date',
      'payment_method',
      'amount',
      'cash_received',
      'change_given',
      'vendor_payment_id',
      'gift_card_id',
      'gift_card_taken',
      'gift_card_change',
      'register_id',
      'is_refund',
    ],
    joins: [
      {
        table: 'sale',
        on: 'sale.id = sale_transaction.sale_id',
        columns: ['item_list'],
      },
    ],
    where: [
      `sale_transaction.date >= '${start_date}'`,
      `sale_transaction.date <= '${end_date}'`,
      `sale.is_deleted = 0`,
      `sale_transaction.is_deleted = 0`,
    ],
    orderBy: `sale_transaction.date`,
  }
}

export function getSaleTransactionsForSaleQuery(sale_id) {
  return {
    table: 'sale_transaction',
    where: `sale_id = ${sale_id}`,
  }
}

export function getSalesByVendorUid(vendor_uid: string) {
  return {
    table: 'sale_item',
    columns: [
      'sale_id',
      'item_id',
      'quantity',
      'is_refunded',
      'store_discount',
      'vendor_discount',
    ],
    joins: [
      {
        table: 'sale',
        columns: ['date_sale_closed'],
        on: `sale.id = sale_item.sale_id`,
      },
      {
        table: 'stock',
        columns: ['vendor_id'],
        on: `stock.id = sale_item.item_id`,
      },
    ],
    where: [
      `sale.state = 'completed'`,
      `NOT sale.is_deleted`,
      `NOT sale_item.is_deleted`,
      `stock.vendor_id = (SELECT id FROM vendor WHERE uid = '${vendor_uid}')`,
    ],
    orderBy: `sale.date_sale_closed`,
    isDesc: 'true',
  }
}

export function getHoldsQuery() {
  return {
    table: 'hold',
    where: `NOT is_deleted AND date_removed_from_hold IS NULL`,
  }
}

/*
 * STOCK QUERIES
 */

export function getStockMovementJoins(types) {
  return types.map((type) => {
    const abbr = type.slice(0, 3)
    return {
      columns: [
        { key: 'stock_id', columnSkip: true },
        { key: 'SUM(quantity)', as: `quantity_${type}` },
      ],
      table: 'stock_movement',
      groupBy: 'stock_id',
      where: `act = '${type}'`,
      on: `${abbr}.stock_id = stock.id`,
      as: abbr,
    }
  })
}

export function getStockQuery(stock_id?, vendor_id?, vendor_uid?) {
  const where = [
    'NOT is_deleted',
    `(p.id = (
  SELECT MAX(id)
  FROM stock_price
  WHERE stock_id = stock.id
) OR stock.is_gift_card OR stock.is_misc_item)`,
  ]
  let columns = []
  if (stock_id) {
    where.unshift(`id = ${stock_id}`)
  } else {
    columns = [
      'id',
      'vendor_id',
      'artist',
      'title',
      'display_as',
      'media',
      'format',
      'section',
      'country',
      'is_new',
      'cond',
      'image_url',
      'is_gift_card',
      'gift_card_code',
      'gift_card_amount',
      'gift_card_remaining',
      'gift_card_is_valid',
      'is_misc_item',
      'misc_item_description',
      'misc_item_amount',
      'needs_restock',
      'is_deleted',
    ]
  }

  let joins = []

  const quantity = {
    columns: [
      { key: 'stock_id', columnSkip: true },
      { key: 'SUM(quantity)', as: 'quantity' },
    ],
    table: 'stock_movement',
    groupBy: 'stock_id',
    on: 'q.stock_id = stock.id',
    as: 'q',
  }
  const price = {
    table: 'stock_price',
    columns: [
      { key: 'id', columnSkip: true },
      { key: 'stock_id', columnSkip: true },
      { key: 'vendor_cut' },
      { key: 'total_sell' },
    ],
    on: 'p.stock_id = stock.id',
    as: 'p',
  }

  if (stock_id) {
    joins = [
      quantity,
      ...getStockMovementJoins([
        StockMovementTypes.Received,
        StockMovementTypes.Returned,
        StockMovementTypes.Sold,
        StockMovementTypes.Unsold,
        StockMovementTypes.Hold,
        StockMovementTypes.Unhold,
        StockMovementTypes.Layby,
        StockMovementTypes.Unlayby,
        StockMovementTypes.Lost,
        StockMovementTypes.Found,
        StockMovementTypes.Discarded,
        StockMovementTypes.Adjustment,
      ]),
      price,
    ]
  } else {
    joins = [
      quantity,
      ...getStockMovementJoins([
        StockMovementTypes.Hold,
        StockMovementTypes.Layby,
        StockMovementTypes.Sold,
      ]),
      price,
    ]
  }

  if (vendor_id) where.unshift(`stock.vendor_id = ${vendor_id}`)
  if (vendor_uid)
    where.unshift(
      `vendor_id = (SELECT id FROM vendor WHERE uid = '${vendor_uid}')`
    )
  return {
    columns,
    table: 'stock',
    joins,
    where,
  }
}

export function getSaleInventoryQuery() {
  return {
    columns: [
      'id',
      'vendor_id',
      'artist',
      'title',
      'display_as',
      'media',
      'format',
      'image_url',
      'is_gift_card',
      'gift_card_code',
      'gift_card_amount',
      'gift_card_remaining',
      'gift_card_is_valid',
      'is_misc_item',
      'misc_item_description',
      'misc_item_amount',
    ],
    table: 'stock',
    joins: [
      {
        table: 'stock_price',
        columns: [
          { key: 'id', columnSkip: true },
          { key: 'stock_id', columnSkip: true },
          { key: 'vendor_cut' },
          { key: 'total_sell' },
        ],
        on: 'p.stock_id = stock.id',
        as: 'p',
      },
    ],
    where: `(p.id = (
  SELECT MAX(id)
  FROM stock_price
  WHERE stock_id = stock.id
) OR stock.is_gift_card OR stock.is_misc_item)
AND stock.is_deleted = 0`,
  }
}

export function getGiftCardsQuery() {
  return {
    columns: [
      'id',
      'is_gift_card',
      'gift_card_code',
      'gift_card_amount',
      'gift_card_remaining',
      'gift_card_is_valid',
      'note',
      'date_created',
      'date_modified',
    ],
    table: 'stock',
    where: `is_gift_card AND NOT is_deleted`,
  }
}

export function getStockPriceByVendorUid(vendorUid: string) {
  return {
    table: 'stock_price',
    where: `stock_id IN (SELECT id FROM stock WHERE vendor_id=(SELECT id FROM vendor WHERE uid = '${vendorUid}'))`,
    orderBy: 'date_valid_from',
    isDesc: 'true',
  }
}

export function getStockMovementsQuery(limit?) {
  return {
    table: 'stock_movement',
    orderBy: 'date_moved',
    isDesc: 'true',
    limit,
  }
}

export function getStockMovementByStockIdQuery(id: number) {
  return {
    table: 'stock_movement',
    where: [`NOT is_deleted`, `stock_id = ${id}`],
    orderBy: 'date_moved',
    isDesc: 'true',
    id: id,
  }
}

export function getStockMovementByVendorUid(vendorUid: string) {
  return {
    table: 'stock_movement',
    where: [
      `NOT is_deleted`,
      `stock_id IN (SELECT id FROM stock WHERE vendor_id=(SELECT id FROM vendor WHERE uid = '${vendorUid}'))`,
    ],
    orderBy: 'date_moved',
  }
}

/*
 *  REGISTER QUERIES
 */

export function getCashGivenQuery(register_id: number) {
  return {
    columns: [
      'sale_id',
      'clerk_id',
      'date',
      'payment_method',
      'amount',
      'change_given',
    ],
    table: 'sale_transaction',
    where: `register_id = ${register_id} AND change_given AND NOT is_deleted`,
  }
}

export function getCashReceivedQuery(register_id: number) {
  return {
    columns: [
      'sale_id',
      'clerk_id',
      'date',
      'payment_method',
      'amount',
      'cash_received',
    ],
    table: 'sale_transaction',
    where: `register_id = ${register_id} AND cash_received AND NOT is_deleted`,
  }
}

export function getManualPaymentsQuery(register_id: number) {
  return {
    columns: ['date', 'amount', 'clerk_id', 'vendor_id'],
    table: 'vendor_payment',
    where: `register_id = ${register_id} AND type = 'cash'`,
  }
}

export function getPettyCashQuery(register_id: number) {
  return {
    table: 'register_petty_cash',
    where: `register_id = ${register_id}`,
  }
}

export function getRegisterIDQuery() {
  return { columns: ['num'], table: 'global', where: `id='current_register'` }
}

export function getRegisterQuery(register_id: number) {
  return { table: 'register', where: `id = ${register_id}` }
}

export function getRegistersQuery(start_date, end_date) {
  return {
    table: 'register',
    where: [`open_date >= '${start_date}'`, `open_date <= '${end_date}'`],
  }
}

/*
 *  JOBS QUERIES
 */

export function getJobsQuery() {
  return {
    table: 'task',
    where: [
      `NOT is_deleted`,
      `NOT is_completed
  OR date_completed > date_sub(now(), interval 1 week)`,
    ],
    orderBy: 'date_created',
    isDesc: 'true',
    // limit: 200,
  }
}

/*
 *  STOCKTAKE QUERIES
 */

export function getStocktakeItemsByStocktakeQuery(stocktake_id: number) {
  return {
    table: 'stocktake_item',
    where: [`NOT is_deleted`, `stocktake_id = ${stocktake_id}`],
    orderBy: 'date_counted',
    isDesc: 'true',
  }
}

export function getStocktakesByTemplateQuery(stocktake_template_id: number) {
  return {
    table: 'stocktake',
    where: [
      `NOT is_deleted`,
      `stocktake_template_id = ${stocktake_template_id}`,
    ],
    orderBy: 'date_started',
    isDesc: 'true',
  }
}

export function getStocktakesQuery() {
  return {
    table: 'stocktake',
    where: `NOT is_deleted`,
  }
}

export function getStocktakeTemplatesQuery() {
  return {
    table: 'stocktake_template',
    where: `NOT is_deleted`,
  }
}

/*
 *  APP QUERIES
 */

export function getAllSelectsQuery() {
  return {
    columns: ['label', 'setting_select'],
    table: 'select_option',
  }
}

export function getSelectQuery(setting_select: string) {
  return {
    columns: ['label'],
    table: 'select_option',
    where: `setting_select = '${setting_select}'`,
  }
}

export function getHelpsQuery() {
  return { table: 'help', where: 'NOT is_deleted' }
}

export function getLogsQuery(limit?) {
  return {
    table: 'log',
    where: `NOT is_deleted AND NOT table_id <=> 'system'`,
    orderBy: 'date_created',
    isDesc: 'true',
    limit: limit || null,
  }
}
